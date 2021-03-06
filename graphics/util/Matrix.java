package util;

import java.lang.Math.*;

public class Matrix implements IMatrix {

    int col, row;
    private double[][] elements, tempElements, tmpInverse;
    private double[] temp, tempNormal;

    public Matrix() {
        this(4, 4, null);
    }

    public Matrix(double[][] elements) {
        this(elements[0].length, elements.length, elements);
    }

    public Matrix(int col, int row) {
        this(col, row, null);
    }

    public Matrix(int col, int row, double[][] elements) {
        this.col = col;
        this.row = row;
        if (elements == null) {
            this.elements = new double[row][col];
        } else {
            this.elements = elements;
        }
        this.temp = new double[4];
        this.tempElements = new double[4][4];
        this.tmpInverse = new double[4][4];
        this.tempNormal = new double[3];
    }

    public void identity() {
        zero();
        for (int i = 0; i < row; i++) {
            set(i, i, 1);
        }
    }

    private void zero() {
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                set(j, i, 0);
            }
        }
    }

    public void set(int col, int row, double value) {
        elements[row][col] = value;
    }

    public double get(int col, int row) {
        return elements[row][col];
    }

    public void translate(double x, double y, double z) {
        set(3, 0, x);
        set(3, 1, y);
        set(3, 2, z);
    }

    public void rotateX(double radians) {
        set(1, 1, Math.cos(radians));
        set(1, 2, Math.sin(radians));
        set(2, 1, -Math.sin(radians));
        set(2, 2, Math.cos(radians));
    }

    public void rotateY(double radians) {
        set(0, 0, Math.cos(radians));
        set(2, 0, Math.sin(radians));
        set(0, 2, -Math.sin(radians));
        set(2, 2, Math.cos(radians));
    }

    public void rotateZ(double radians) {
        set(0, 0, Math.cos(radians));
        set(1, 0, -Math.sin(radians));
        set(0, 1, Math.sin(radians));
        set(1, 1, Math.cos(radians));
    }

    public void scale(double x, double y, double z) {
        set(0, 0, x);
        set(1, 1, y);
        set(2, 2, z);
    }

    public void leftMultiply(Matrix other) {
        // other * this
        if (other.col != this.row) {
            System.err.println("attempt to multiply incompatible matrices.");
            System.exit(1);
        } else {

            tempCopy();

            for (int i = 0; i < other.row; i++) {
                for (int j = 0; j < tempElements[0].length; j++) {
                    // multiply other row by this col to get replacement elements[i][j]
                    double replacement = 0;
                    for (int k = 0; k < other.col; k++) {
                        replacement += other.get(k, i) * tempElements[k][j];
                    }
                    this.set(j, i, replacement);
                }
            }
        }
    }

    public void rightMultiply(Matrix other) {
        // this * other
        if (this.col != other.row) {
            System.err.println("attempt to multiply incompatible matrices.");
            System.exit(1);
        } else {

            tempCopy();

            for (int i = 0; i < tempElements.length; i++) {
                for (int j = 0; j < other.col; j++) {
                    // multiply this row by other col to get replacement elements[i][j]
                    double replacement = 0;
                    for (int k = 0; k < tempElements[0].length; k++) {
                        replacement += tempElements[i][k] * other.get(j, k);
                    }
                    this.set(j, i, replacement);
                }
            }
        }
    }

    private void tempCopy() {
        for (int i = 0; i < this.row; i++) {
            for (int j = 0; j < this.col; j++) {
                tempElements[i][j] = elements[i][j];
            }
        }
    }

    public void copyTo(Matrix dest) {
        for (int i = 0; i < this.row; i++) {
            for (int j = 0; j < this.col; j++) {
                dest.set(j, i, elements[i][j]);
            }
        }
    }

    public void transform(double[] src, double[] dst) {

        for (int i = 0; i < 3; i++) {
            temp[i] = src[i];
        }
        temp[3] = 1;

        for (int i = 0; i < 3; i++) {
            double replacement = 0;
            for (int j = 0; j < 4; j++) {
                replacement += temp[j] * this.get(j, i);
            }
            dst[i] = replacement;
        }

        // TRANSFORM SURFACE NORMALS
        tempCopy();
        Invert.invert(tempElements, tmpInverse);
        transpose(tmpInverse, tempElements);

        tempNormal[0] = src[3];
        tempNormal[1] = src[4];
        tempNormal[2] = src[5];

        dot(tempElements, tempNormal, temp);

        dst[3] = temp[0];
        dst[4] = temp[1];
        dst[5] = temp[2];
    }

    private void transpose(double[][] src, double[][] dst) {
        for (int i = 0; i < src.length; i++) {
            for (int j = 0; j < src[0].length; j++) {
                dst[j][i] = src[i][j];
            }
        }
    }

    private void dot(double[][] matrix, double[] normal, double[] dst) {
        for (int i = 0; i < dst.length; i++) {
            dst[i] = 0.0;
        }

        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < normal.length; j++) {
                dst[i] += matrix[i][j] * normal[j];
            }
        }
    }
}