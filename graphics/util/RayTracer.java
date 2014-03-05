package util;

import java.lang.Math.*;
import java.util.ArrayList;

public class RayTracer {

    int width, height;
    int[] tmpBgColor, tmpBgColor2, tmpIntColor;
    int[][] pix;
    double[][] antialiasBuf;
    double FL, closestDepth;
    double[] v, w, s, v_s, nn, t, tempColor, tempVector;
    ArrayList<RayShape> sceneChildren;
    Material tempMaterial;

    boolean ss = false, aa = false, textures = false, shadows = false;
    int type = 2, subSampleRate = 4;

    // ARRAY OF LIGHTS
    double[][][] lights = {
        { { 0.1, 0.1, 1.05}, {1.0, 1.0, 1.0} },
        { {-0.25,-0.25,-0.25}, {1.0, 1.0, 1.0} },
        { {0.0, 0.0, 1.05},  {1.0, 1.0, 1.0} },
    };
    double[] eyeDir = {0.0, 0.0, 1.0};

    public RayTracer(int w, int h) {

        this.width = w;
        this.height = h;

        this.tmpBgColor = new int[3];
        this.tmpBgColor2 = new int[3];
        this.tmpIntColor = new int[3];

        this.pix = new int[width * height][3];
        this.antialiasBuf = new double[9][3];

        this.FL = 10;

        this.v = new double[3];
        this.w = new double[3];
        this.s = new double[4];
        this.v_s = new double[3];
        this.nn = new double[3];
        this.t = new double[2];
        this.tempColor = new double[3];
        this.tempVector = new double[3];

        this.sceneChildren = new ArrayList<RayShape>();
    }

    // USED BY MISAPPLET TO GET THE RGB FOR A SPECIFIC PIXEL
    public int[] getPix(int x, int y) {
        return pix[x + width * y];
    }

    public void resetPix() {
        for (int y = height - 4; y < height; y++) {
            for (int x = 0; x < width; x++) {
                pix[x + width * y][0] = (int) interpolate(y / (double) height, tmpBgColor[0], tmpBgColor2[0]);
                pix[x + width * y][1] = (int) interpolate(y / (double) height, tmpBgColor[1], tmpBgColor2[1]);
                pix[x + width * y][2] = (int) interpolate(y / (double) height, tmpBgColor[2], tmpBgColor2[2]);
            }
        }

        for (int x = width - 4; x < width; x++) {
            for (int y = 0; y < height; y++) {
                pix[x + width * y][0] = (int) interpolate(y / (double) height, tmpBgColor[0], tmpBgColor2[0]);
                pix[x + width * y][1] = (int) interpolate(y / (double) height, tmpBgColor[1], tmpBgColor2[1]);
                pix[x + width * y][2] = (int) interpolate(y / (double) height, tmpBgColor[2], tmpBgColor2[2]);
            }
        }
    }

    // MAIN LOOP
    public void renderWorld() {

        castAndSet(0, 0);

        for (int y = subSampleRate; y < height; y += subSampleRate) {

            castAndSet(0, y);

            for (int x = subSampleRate; x < width; x += subSampleRate) {

                if (ss) {
                    if (edgeDetect(x, y, subSampleRate)) {
                        // EDGE DETECTED. CAST MORE RAYS.
                        for (int ySub = y - subSampleRate; ySub < y; ySub++) {
                            for (int xSub = x - subSampleRate; xSub < x; xSub++) {
                                castAndSet(xSub, ySub);
                            }
                        }
                    } else {
                        // NO EDGE DETECTED. JUST INTERPOLATE.
                        castAndSet(x - subSampleRate, y - subSampleRate);

                        int[] q12 = pix[(x - subSampleRate) + width * y];
                        int[] q21 = pix[x + width * (y - subSampleRate)];
                        int[] q11 = pix[(x - subSampleRate) + width * (y - subSampleRate)];
                        int[] q22 = pix[x + width * y];

                        for (int ySub = y - subSampleRate; ySub < y; ySub++) {
                            double upPercent = (y - ySub) / (double) subSampleRate;
                            for (int xSub = x - subSampleRate; xSub < x; xSub++) {
                                double leftPercent = (x - xSub) / (double) subSampleRate;

                                pix[xSub + width * ySub][0] = (int) interpolate(q11[0], q12[0], q21[0], q22[0], xSub, x - subSampleRate, x, ySub, y - subSampleRate, y);
                                pix[xSub + width * ySub][1] = (int) interpolate(q11[1], q12[1], q21[1], q22[1], xSub, x - subSampleRate, x, ySub, y - subSampleRate, y);
                                pix[xSub + width * ySub][2] = (int) interpolate(q11[2], q12[2], q21[2], q22[2], xSub, x - subSampleRate, x, ySub, y - subSampleRate, y);
                            }
                        }
                    }
                } else {
                    for (int ySub = y - subSampleRate; ySub < y; ySub++) {
                        for (int xSub = x - subSampleRate; xSub < x; xSub++) {
                            castAndSet(xSub, ySub);
                        }
                    }
                }
            }
        }

        if (aa) {

            for (int y = 1; y < height - 1; y++) {
                for (int x = 1; x < width - 1; x++) {
                    if (edgeDetect(x, y, 1)) {
                        superSample(x, y);
                        superSample(x - 1, y);
                        superSample(x, y - 1);
                    }
                }
            }
        }
    }

    private void superSample(int x, int y) {
        castRay(x, y);
        copyVector(tempColor, antialiasBuf[0]);
        castRay(x - 0.5, y);
        copyVector(tempColor, antialiasBuf[1]);
        castRay(x, y - 0.5);
        copyVector(tempColor, antialiasBuf[2]);
        castRay(x - 0.5, y - 0.5);
        copyVector(tempColor, antialiasBuf[3]);
        castRay(x - 0.5, y + 0.5);
        copyVector(tempColor, antialiasBuf[4]);
        castRay(x, y + 0.5);
        copyVector(tempColor, antialiasBuf[5]);
        castRay(x + 0.5, y + 0.5);
        copyVector(tempColor, antialiasBuf[6]);
        castRay(x + 0.5, y);
        copyVector(tempColor, antialiasBuf[7]);
        castRay(x + 0.5, y - 0.5);
        copyVector(tempColor, antialiasBuf[8]);

        double rTotal = 0.0, gTotal = 0.0, bTotal = 0.0;

        for (int i = 0; i < antialiasBuf.length; i++) {
            rTotal += antialiasBuf[i][0];
            gTotal += antialiasBuf[i][1];
            bTotal += antialiasBuf[i][2];
        }

        pix[x + width * y][0] = (int) (rTotal / (double) antialiasBuf.length);
        pix[x + width * y][1] = (int) (gTotal / (double) antialiasBuf.length);
        pix[x + width * y][2] = (int) (bTotal / (double) antialiasBuf.length);
    }

    private void castAndSet(int i, int j) {
        castRay(i, j);
        pix[i + width * j][0] = (int) tempColor[0];
        pix[i + width * j][1] = (int) tempColor[1];
        pix[i + width * j][2] = (int) tempColor[2];
    }

    // CASTS A RAY AT (I,J)
    private boolean castRay(double i, double j) {

        double x = 0.8 * ((i + 0.5) / width - 0.5);
        double y = 0.8 * ((j + 0.5) / width - 0.5 * height / width);

        set(v, 0, 0, FL);
        set(w, x, y, -FL);

        normalize(w);

        RayShape closest = closest(v, w, t);

        if (closest != null) {
            RaySphere sphere = (RaySphere) closest;
            tempMaterial = sphere.getMaterial();

            s[0] = sphere.getPosition()[0];
            s[1] = sphere.getPosition()[1];
            s[2] = sphere.getPosition()[2];
            s[3] = sphere.getRadius();

            for (int k = 0; k < 3; k++) {
                nn[k] = v[k] + closestDepth * w[k] - s[k];
            }
            normalize(nn);
            computeShading(nn, closest);

            return true;
        } else {

            tempColor[0] = interpolate(j / (double) height, tmpBgColor[0], tmpBgColor2[0]);
            tempColor[1] = interpolate(j / (double) height, tmpBgColor[1], tmpBgColor2[1]);
            tempColor[2] = interpolate(j / (double) height, tmpBgColor[2], tmpBgColor2[2]);

            return false;
        }
    }

    // CASTS A RAY FROM (X1, Y1, Z1) to (X2, Y2, Z2)
    private boolean castRay(RayShape sphere, double x1, double y1, double z1, double x2, double y2, double z2) {

        set(v, x1, y1, z1);
        set(w, x2, y2, z2);

        for (int it = 0; it < sceneChildren.size(); it++) {
            RayShape shape = sceneChildren.get(it);
            if (shape != sphere) {

                RaySphere targetSphere = (RaySphere) shape;

                s[0] = targetSphere.getPosition()[0];
                s[1] = targetSphere.getPosition()[1];
                s[2] = targetSphere.getPosition()[2];
                s[3] = targetSphere.getRadius();

                // System.err.println("against sphere at " + s[0] + "," + s[1]);
                // System.err.println("vector starts at " + x1 + "," + y1 + "," + z1);
                // System.err.println("and goes to      " + x2 + "," + y2 + "," + z2);

                if (rayTrace(v, w, t) && (t[0] > 0 || t[1] > 0)) {
                    // System.err.println("we have a bingo\n");
                    return true;
                }
            }
        }

        // System.err.println();

        return false;
    }

    private RayShape closest(double[] v, double[] w, double[] t) {
        RayShape closest = null;
        closestDepth = 100000;

        for (int it = 0; it < sceneChildren.size(); it++) {
            RaySphere sphere = (RaySphere) sceneChildren.get(it);

            s[0] = sphere.getPosition()[0];
            s[1] = sphere.getPosition()[1];
            s[2] = sphere.getPosition()[2];
            s[3] = sphere.getRadius();

            diff(v, s, v_s);

            double a = 1.0;
            double b = 2 * dot(w, v_s);
            double c = dot(v_s, v_s) - s[3] * s[3];

            if (solveQuadraticEquation(a, b, c, t) && t[0] < closestDepth) {
                closest = sphere;
                closestDepth = t[0];
            }
        }

        return closest;
    }

    // RETURNS TRUE IF AN EDGE IS DETECTED IN THE 4X4 PX SQUARE WITH X,Y AS THE BOTTOM RIGHT CORNER
    private boolean edgeDetect(int x, int y, int diff) {

        castAndSet(x, y);

        int[] left = pix[(x - diff) + width * y];
        int[] up = pix[x + width * (y - diff)];
        int[] upLeft = pix[(x - diff) + width * (y - diff)];
        int[] current = pix[x + width * y];

        int leftDiff = (current[0] - left[0]) * (current[0] - left[0]) + (current[1] - left[1]) * (current[1] - left[1]) + (current[2] - left[2]) * (current[2] - left[2]);
        int upDiff = (current[0] - up[0]) * (current[0] - up[0]) + (current[1] - up[1]) * (current[1] - up[1]) + (current[2] - up[2]) * (current[2] - up[2]);
        int upLeftDiff = (current[0] - upLeft[0]) * (current[0] - upLeft[0]) + (current[1] - upLeft[1]) * (current[1] - upLeft[1]) + (current[2] - upLeft[2]) * (current[2] - upLeft[2]);

        if (leftDiff > 5000 || upDiff > 5000 || upLeftDiff > 5000) {
            return true;
        } else {
            return false;
        }
    }

    // DETERMINE IF A GIVEN RAY INTERSECTS A GIVEN SPHERE
    private boolean rayTrace(double[] v, double[] w, double[] t) {
        diff(v, s, v_s);

        double a = 1.0;
        double b = 2 * dot(w, v_s);
        double c = dot(v_s, v_s) - s[3] * s[3];

        return solveQuadraticEquation(a, b, c, t);
    }

    // DOES WHAT IT SAYS
    private boolean solveQuadraticEquation(double a, double b, double c, double[] t) {
        double discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return false;
        }

        double d = Math.sqrt(discriminant);
        t[0] = (-b - d) / (2 * a);
        t[1] = (-b + d) / (2 * a);
        return true;
    }

    // COMPUTE SHADING FOR INDIVIDUAL PIXEL, DEPENDING ON NORMAL DIRECTION
    private void computeShading(double[] nn, RayShape sphere) {

        // RESET TEMPORARY COLOR ARRAY
        for (int i = 0; i < tempColor.length; i++) {
            tempColor[i] = tempMaterial.getAmbientColor()[i];
        }

        if (textures) {
            double f0 = f(nn[0]      ,nn[1]      ,nn[2]      ),
                   fx = f(nn[0]+.0001,nn[1]      ,nn[2]      ),
                   fy = f(nn[0]      ,nn[1]+.0001,nn[2]      ),
                   fz = f(nn[0]      ,nn[1]      ,nn[2]+.0001);

            // SUBTRACT THE FUNCTION'S GRADIENT FROM THE SURFACE NORMAL

            nn[0] -= (fx - f0) / .0001;
            nn[1] -= (fy - f0) / .0001;
            nn[2] -= (fz - f0) / .0001;
        }

        // System.err.println("checking sphere at " + s[0] + "," + s[1] + " at point " + s[0] + nn[0] + "," + s[1] + nn[1]);

        // FOR EACH LIGHT SOURCE
        for (int i = 0; i < lights.length; i++) {

            // System.err.println("looking for blockages to light at " + lights[i][0][0] + "," + lights[i][0][1] + "," + lights[i][0][2]);

            // CHECK TO SEE IF SOMETHING IS BLOCKING THE LIGHT AND SPHERE

            // LIGHT DIRECTION
            double[] lDir = lights[i][0];

            if (!shadows || !castRay(sphere, s[0] + nn[0], s[1] + nn[1], s[2] + nn[2], lights[i][0][0], lights[i][0][1], lights[i][0][2])) {

                // REFLECTION DIRECTION
                for (int k = 0; k < lDir.length; k++) {
                    tempVector[k] = 2 * (dot(lDir, nn)) * nn[k] - lDir[k];
                }
                double[] rDir = tempVector;
                normalize(rDir);

                // FOR EACH COLOR IN RGB
                for (int j = 0; j < 3; j++) {
                    tempColor[j] += lights[i][1][j] *
                                   (tempMaterial.getDiffuseColor()[j] * Math.max(0.0, dot(lDir, nn)) +
                                    tempMaterial.getSpecularColor()[j] * Math.pow(Math.max(0.0, dot(rDir, eyeDir)), tempMaterial.getSpecularPower()));
                }
            }
        }

        // GAMMA CORRECTION
        tempColor[0] = 255.0 * Math.pow(tempColor[0], 0.45);
        tempColor[1] = 255.0 * Math.pow(tempColor[1], 0.45);
        tempColor[2] = 255.0 * Math.pow(tempColor[2], 0.45);
    }

    // SETS VALUES FOR A SINGLE VECTOR
    private void set(double[] vector, double x, double y, double z) {
        vector[0] = x;
        vector[1] = y;
        vector[2] = z;
    }

    // NORMALIZES A VECTOR
    private void normalize(double[] vector) {
        double length = Math.sqrt(vector[0] * vector[0] +
                                  vector[1] * vector[1] +
                                  vector[2] * vector[2]);
        vector[0] /= length;
        vector[1] /= length;
        vector[2] /= length;
    }

    // SUBTRACTS V2 FROM V1 AND SETS TO V3
    private void diff(double[] v1, double[] v2, double[] v3) {
        v3[0] = v1[0] - v2[0];
        v3[1] = v1[1] - v2[1];
        v3[2] = v1[2] - v2[2];
    }

    // RETURNS THE DOT PRODUCT OF A AND B
    private double dot(double[] a, double[] b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    // ADDS A SHAPE TO THE SCENE
    public void add(RayShape shape) {
        sceneChildren.add(shape);
    }

    // REMOVES A SHAPE FROM THE SCENE
    public void remove(RayShape shape) {
        sceneChildren.remove(shape);
    }

    // SETS THE BACKGROUND COLOR, AS WELL AS THE GRADIENT COLOR
    public void setBGColor(int[] rgb) {
        for (int i = 0; i < rgb.length; i++) {
            this.tmpBgColor[i] = rgb[i] - 50;
        }

        for (int i = 0; i < rgb.length; i++) {
            this.tmpBgColor2[i] = rgb[i] + 50;
        }
    }

    // RETURNS THE ARRAY OF LIGHTS IN THE SCENE
    public double[][][] getLights() {
        return lights;
    }

    // INTERPOLATE BETWEEN TWO POINTS
    private double interpolate(double percent, double one, double two) {
        return percent * (two - one) + one;
    }

    // INTERPOLATE BETWEEN THREE POINTS
    private double interpolate(int q11, int q12, int q21, int q22, int x, int x1, int x2, int y, int y1, int y2) {
        return (1 / (double) ((x2 - x1) * (y2 - y1))) * ((q11 * (x2 - x) * (y2 - y)) +
                                                         (q21 * (x - x1) * (y2 - y)) +
                                                         (q12 * (x2 - x) * (y - y1)) +
                                                         (q22 * (x - x1) * (y - y1)));
    }

    double f(double x, double y, double z) {
        switch (type) {
        case 0:  return  .06 * noise(x/2.0,y/2.0,z/2.0, 8);
        case 1:  return  .01 * stripes(x + 2*turbulence(x/2.0,y/2.0,z/2.0,1), 1.6);
        default: return -.10 * turbulence(x/2.0,y/2.0,z/2.0, 1);
        }
    }

    // STRIPES TEXTURE (GOOD FOR MAKING MARBLE)

    double stripes(double x, double f) {
       double t = .5 + .5 * Math.sin(f * 2*Math.PI * x);
       return t * t - .5;
    }

    // TURBULENCE TEXTURE

    double turbulence(double x, double y, double z, double freq) {
       double t = -.5;
       for ( ; freq <= width/12 ; freq *= 2)
          t += Math.abs(noise(x,y,z,freq) / freq);
       return t;
    }

    // NOISE TEXTURE

    double noise(double x, double y, double z, double freq) {
       double x1, y1, z1;
       x1 = .707*x-.707*z;
       z1 = .707*x+.707*z;
       y1 = .707*x1+.707*y;
       x1 = .707*x1-.707*y;
       return ImprovedNoise.noise(freq*x1 + 100, freq*y1, freq*z1);
    }

    public void copyVector(double[] a, double[] b) {
        for (int i = 0; i < a.length; i++) {
            b[i] = a[i];
        }
    }

    public void toggleSS() {
        this.ss = !this.ss;
    }

    public void toggleAA() {
        this.aa = !this.aa;
    }

    public void setSSRate(int rate) {
        this.subSampleRate = rate;
    }

    public void toggleTextures() {
        this.textures = !this.textures;
    }

    public void setTexture(int type) {
        this.type = type;
    }

    public void toggleShadows() {
        this.shadows = !this.shadows;
    }

    public void resetStuff() {
        this.ss = false;
        this.aa = false;
        this.subSampleRate = 2;
        this.textures = false;
        this.type = 0;
        this.shadows = false;
    }
}