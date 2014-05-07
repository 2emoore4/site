(function(){var t,e,i,s,r,o,n,h,p,c,a,l,u,_,f,m,d,$,y,v,g,x,b,k,w,C,T,S,M,P,H,E,L,I,W,D,A,R=function(t,e){return function(){return t.apply(e,arguments)}},U=[].slice;t=jQuery;I=0;W=1;D=2;w=13;H=9;x=46;g=8;T=37;P=39;E=38;b=40;C=36;k=35;M=33;S=34;p="jqconsole-";r=""+p+"cursor";o=""+p+"header";c=""+p+"prompt";h=""+p+"old-prompt";n=""+p+"input";s=""+p+"blurred";y="keypress";m="<span/>";_="<div/>";f=":empty";L="\n";u=">>> ";l="... ";a=2;i=""+p+"ansi-";d="";$=/\[(\d*)(?:;(\d*))*m/;e=function(){t.prototype.COLORS=["black","red","green","yellow","blue","magenta","cyan","white"];function t(){this.stylize=R(this.stylize,this);this._closeSpan=R(this._closeSpan,this);this._openSpan=R(this._openSpan,this);this.getClasses=R(this.getClasses,this);this._style=R(this._style,this);this._color=R(this._color,this);this._remove=R(this._remove,this);this._append=R(this._append,this);this.klasses=[]}t.prototype._append=function(t){t=""+i+t;if(this.klasses.indexOf(t)===-1){return this.klasses.push(t)}};t.prototype._remove=function(){var t,e,s,r,o,n;s=1<=arguments.length?U.call(arguments,0):[];n=[];for(r=0,o=s.length;r<o;r++){e=s[r];if(e==="fonts"||e==="color"||e==="background-color"){n.push(this.klasses=function(){var s,r,o,n;o=this.klasses;n=[];for(s=0,r=o.length;s<r;s++){t=o[s];if(t.indexOf(e)!==i.length){n.push(t)}}return n}.call(this))}else{e=""+i+e;n.push(this.klasses=function(){var i,s,r,o;r=this.klasses;o=[];for(i=0,s=r.length;i<s;i++){t=r[i];if(t!==e){o.push(t)}}return o}.call(this))}}return n};t.prototype._color=function(t){return this.COLORS[t]};t.prototype._style=function(t){if(t===""){t=0}t=parseInt(t);if(isNaN(t)){return}switch(t){case 0:return this.klasses=[];case 1:return this._append("bold");case 2:return this._append("lighter");case 3:return this._append("italic");case 4:return this._append("underline");case 5:return this._append("blink");case 6:return this._append("blink-rapid");case 8:return this._append("hidden");case 9:return this._append("line-through");case 10:return this._remove("fonts");case 11:case 12:case 13:case 14:case 15:case 16:case 17:case 18:case 19:this._remove("fonts");return this._append("fonts-"+(t-10));case 20:return this._append("fraktur");case 21:return this._remove("bold","lighter");case 22:return this._remove("bold","lighter");case 23:return this._remove("italic","fraktur");case 24:return this._remove("underline");case 25:return this._remove("blink","blink-rapid");case 28:return this._remove("hidden");case 29:return this._remove("line-through");case 30:case 31:case 32:case 33:case 34:case 35:case 36:case 37:this._remove("color");return this._append("color-"+this._color(t-30));case 39:return this._remove("color");case 40:case 41:case 42:case 43:case 44:case 45:case 46:case 47:this._remove("background-color");return this._append("background-color-"+this._color(t-40));case 49:return this._remove("background-color");case 51:return this._append("framed");case 53:return this._append("overline");case 54:return this._remove("framed");case 55:return this._remove("overline")}};t.prototype.getClasses=function(){return this.klasses.join(" ")};t.prototype._openSpan=function(t){return'<span class="'+this.getClasses()+'">'+t};t.prototype._closeSpan=function(t){return""+t+"</span>"};t.prototype.stylize=function(t){var e,i,s,r,o,n;t=this._openSpan(t);s=0;while((s=t.indexOf(d,s))&&s!==-1){if(i=t.slice(s).match($)){n=i.slice(1);for(r=0,o=n.length;r<o;r++){e=n[r];this._style(e)}t=this._closeSpan(t.slice(0,s))+this._openSpan(t.slice(s+1+i[0].length))}else{s++}}return this._closeSpan(t)};return t}();A=function(t,e){return'<span class="'+t+'">'+(e||"")+"</span>"};v=function(){function i(i,s,r,n){this._HideComposition=R(this._HideComposition,this);this._ShowComposition=R(this._ShowComposition,this);this._UpdateComposition=R(this._UpdateComposition,this);this._EndComposition=R(this._EndComposition,this);this._StartComposition=R(this._StartComposition,this);this._CheckComposition=R(this._CheckComposition,this);this._ProcessMatch=R(this._ProcessMatch,this);this._HandleKey=R(this._HandleKey,this);this._HandleChar=R(this._HandleChar,this);this.isMobile=!!navigator.userAgent.match(/iPhone|iPad|iPod|Android/i);this.isIos=!!navigator.userAgent.match(/iPhone|iPad|iPod/i);this.isAndroid=!!navigator.userAgent.match(/Android/i);this.$window=t(window);this.header=s||"";this.prompt_label_main=typeof r==="string"?r:u;this.prompt_label_continue=n||l;this.indent_width=a;this.state=W;this.input_queue=[];this.input_callback=null;this.multiline_callback=null;this.history=[];this.history_index=0;this.history_new="";this.history_active=false;this.shortcuts={};this.$container=t("<div/>").appendTo(i);this.$container.css({top:0,left:0,right:0,bottom:0,position:"absolute",overflow:"auto"});this.$console=t('<pre class="jqconsole"/>').appendTo(this.$container);this.$console.css({margin:0,position:"relative","min-height":"100%","box-sizing":"border-box","-moz-box-sizing":"border-box","-webkit-box-sizing":"border-box"});this.$console_focused=true;this.$input_container=t(_).appendTo(this.$container);this.$input_container.css({position:"absolute",width:1,height:0,overflow:"hidden"});this.$input_source=this.isAndroid?t("<input/>"):t("<textarea/>");this.$input_source.attr({wrap:"off",autocapitalize:"off",autocorrect:"off",spellcheck:"false",autocomplete:"off"});this.$input_source.css({position:"absolute",width:2});this.$input_source.appendTo(this.$input_container);this.$composition=t(_);this.$composition.addClass(""+p+"composition");this.$composition.css({display:"inline",position:"relative"});this.matchings={openings:{},closings:{},clss:[]};this.ansi=new e;this._InitPrompt();this._SetupEvents();this.Write(this.header,o);t(i).data("jqconsole",this)}i.prototype.ResetHistory=function(){return this.SetHistory([])};i.prototype.ResetShortcuts=function(){return this.shortcuts={}};i.prototype.ResetMatchings=function(){return this.matchings={openings:{},closings:{},clss:[]}};i.prototype.Reset=function(){if(this.state!==W){this.ClearPromptText(true)}this.state=W;this.input_queue=[];this.input_callback=null;this.multiline_callback=null;this.ResetHistory();this.ResetShortcuts();this.ResetMatchings();this.$prompt.detach();this.$input_container.detach();this.$console.html("");this.$prompt.appendTo(this.$console);this.$input_container.appendTo(this.$container);this.Write(this.header,o);return void 0};i.prototype.GetHistory=function(){return this.history};i.prototype.SetHistory=function(t){this.history=t.slice();return this.history_index=this.history.length};i.prototype._CheckKeyCode=function(t){if(isNaN(t)){t=t.charCodeAt(0)}else{t=parseInt(t,10)}if(!(0<t&&t<256)||isNaN(t)){throw new Error("Key code must be a number between 0 and 256 exclusive.")}return t};i.prototype._LetterCaseHelper=function(t,e){e(t);if(65<=t&&t<=90){e(t+32)}if(97<=t&&t<=122){return e(t-32)}};i.prototype.RegisterShortcut=function(t,e){var i,s=this;t=this._CheckKeyCode(t);if(typeof e!=="function"){throw new Error("Callback must be a function, not "+e+".")}i=function(t){if(!(t in s.shortcuts)){s.shortcuts[t]=[]}return s.shortcuts[t].push(e)};this._LetterCaseHelper(t,i);return void 0};i.prototype.UnRegisterShortcut=function(t,e){var i,s=this;t=this._CheckKeyCode(t);i=function(t){if(t in s.shortcuts){if(e){return s.shortcuts[t].splice(s.shortcuts[t].indexOf(e),1)}else{return delete s.shortcuts[t]}}};this._LetterCaseHelper(t,i);return void 0};i.prototype.GetColumn=function(){var t;this.$prompt_right.detach();this.$prompt_cursor.text("");t=this.$console.text().split(L);this.$prompt_cursor.html("&nbsp;");this.$prompt_cursor.after(this.$prompt_right);return t[t.length-1].length};i.prototype.GetLine=function(){return this.$console.text().split(L).length-1};i.prototype.ClearPromptText=function(t){if(this.state===W){throw new Error("ClearPromptText() is not allowed in output state.")}this.$prompt_before.html("");this.$prompt_after.html("");this.$prompt_label.text(t?"":this._SelectPromptLabel(false));this.$prompt_left.text("");this.$prompt_right.text("");return void 0};i.prototype.GetPromptText=function(e){var i,s,r,o,n;if(this.state===W){throw new Error("GetPromptText() is not allowed in output state.")}if(e){this.$prompt_cursor.text("");n=this.$prompt.text();this.$prompt_cursor.html("&nbsp;");return n}else{o=function(e){var i;i=[];e.children().each(function(){return i.push(t(this).children().last().text())});return i.join(L)};s=o(this.$prompt_before);if(s){s+=L}r=this.$prompt_left.text()+this.$prompt_right.text();i=o(this.$prompt_after);if(i){i=L+i}return s+r+i}};i.prototype.SetPromptText=function(t){if(this.state===W){throw new Error("SetPromptText() is not allowed in output state.")}this.ClearPromptText(false);this._AppendPromptText(t);this._ScrollToEnd();return void 0};i.prototype.SetPromptLabel=function(t,e){this.prompt_label_main=t;if(e!=null){this.prompt_label_continue=e}return void 0};i.prototype.Write=function(e,i,s){var r;if(s==null){s=true}if(s){e=this.ansi.stylize(t(m).text(e).html())}r=t(m).html(e);if(i!=null){r.addClass(i)}return this.Append(r)};i.prototype.Append=function(e){var i;i=t(e).insertBefore(this.$prompt);this._ScrollToEnd();this.$prompt_cursor.detach().insertAfter(this.$prompt_left);return i};i.prototype.Input=function(t){var e,i,s,r,o=this;if(this.state===D){s=this.input_callback;r=this.multiline_callback;i=this.history_active;e=this.async_multiline;this.AbortPrompt();this.input_queue.unshift(function(){return o.Prompt(i,s,r,e)})}else if(this.state!==W){this.input_queue.push(function(){return o.Input(t)});return}this.history_active=false;this.input_callback=t;this.multiline_callback=null;this.state=I;this.$prompt.attr("class",n);this.$prompt_label.text(this._SelectPromptLabel(false));this.Focus();this._ScrollToEnd();return void 0};i.prototype.Prompt=function(t,e,i,s){var r=this;if(this.state!==W){this.input_queue.push(function(){return r.Prompt(t,e,i,s)});return}this.history_active=t;this.input_callback=e;this.multiline_callback=i;this.async_multiline=s;this.state=D;this.$prompt.attr("class",c+" "+this.ansi.getClasses());this.$prompt_label.text(this._SelectPromptLabel(false));this.Focus();this._ScrollToEnd();return void 0};i.prototype.AbortPrompt=function(){if(this.state!==D){throw new Error("Cannot abort prompt when not in prompt state.")}this.Write(this.GetPromptText(true)+L,h);this.ClearPromptText(true);this.state=W;this.input_callback=this.multiline_callback=null;this._CheckInputQueue();return void 0};i.prototype.Focus=function(){if(!this.IsDisabled()){this.$input_source.focus()}return void 0};i.prototype.SetIndentWidth=function(t){return this.indent_width=t};i.prototype.GetIndentWidth=function(){return this.indent_width};i.prototype.RegisterMatching=function(t,e,i){var s;s={opening_char:t,closing_char:e,cls:i};this.matchings.clss.push(i);this.matchings.openings[t]=s;return this.matchings.closings[e]=s};i.prototype.UnRegisterMatching=function(t,e){var i;i=this.matchings.openings[t].cls;delete this.matchings.openings[t];delete this.matchings.closings[e];return this.matchings.clss.splice(this.matchings.clss.indexOf(i),1)};i.prototype.Dump=function(){var e,i;e=this.$console.find("."+o).nextUntil("."+c).addBack();return function(){var s,r,o;o=[];for(s=0,r=e.length;s<r;s++){i=e[s];if(t(i).is("."+h)){o.push(t(i).text().replace(/^\s+/,">>> "))}else{o.push(t(i).text())}}return o}().join("")};i.prototype.GetState=function(){if(this.state===I){return"input"}else if(this.state===W){return"output"}else{return"prompt"}};i.prototype.Disable=function(){this.$input_source.attr("disabled",true);return this.$input_source.blur()};i.prototype.Enable=function(){return this.$input_source.attr("disabled",false)};i.prototype.IsDisabled=function(){return Boolean(this.$input_source.attr("disabled"))};i.prototype.MoveToStart=function(t){this._MoveTo(t,true);return void 0};i.prototype.MoveToEnd=function(t){this._MoveTo(t,false);return void 0};i.prototype.Clear=function(){this.$console.find("."+o).nextUntil("."+c).addBack().text("");this.$prompt_cursor.detach();return this.$prompt_after.before(this.$prompt_cursor)};i.prototype._CheckInputQueue=function(){if(this.input_queue.length){return this.input_queue.shift()()}};i.prototype._InitPrompt=function(){this.$prompt=t(A(n)).appendTo(this.$console);this.$prompt_before=t(m).appendTo(this.$prompt);this.$prompt_current=t(m).appendTo(this.$prompt);this.$prompt_after=t(m).appendTo(this.$prompt);this.$prompt_label=t(m).appendTo(this.$prompt_current);this.$prompt_left=t(m).appendTo(this.$prompt_current);this.$prompt_right=t(m).appendTo(this.$prompt_current);this.$prompt_right.css({position:"relative"});this.$prompt_cursor=t(A(r,"&nbsp;"));this.$prompt_cursor.insertBefore(this.$prompt_right);this.$prompt_cursor.css({color:"transparent",display:"inline",zIndex:0});if(!this.isMobile){return this.$prompt_cursor.css("position","absolute")}};i.prototype._SetupEvents=function(){var t=this;if(this.isMobile){this.$console.click(function(e){e.preventDefault();return t.Focus()})}else{this.$console.mouseup(function(e){var i;if(e.which===2){return t.Focus()}else{i=function(){if(!window.getSelection().toString()){e.preventDefault();return t.Focus()}};return setTimeout(i,0)}})}this.$input_source.focus(function(){var e,i;t._ScrollToEnd();t.$console_focused=true;t.$console.removeClass(s);i=function(){if(t.$console_focused){return t.$console.removeClass(s)}};setTimeout(i,100);e=function(){if(t.isIos&&t.$console_focused){return t.$input_source.hide()}};return setTimeout(e,500)});this.$input_source.blur(function(){var e;t.$console_focused=false;if(t.isIos){t.$input_source.show()}e=function(){if(!t.$console_focused){return t.$console.addClass(s)}};return setTimeout(e,100)});this.$input_source.bind("paste",function(){var e;e=function(){if(t.in_composition){return}t._AppendPromptText(t.$input_source.val());t.$input_source.val("");return t.Focus()};return setTimeout(e,0)});this.$input_source.keypress(this._HandleChar);this.$input_source.keydown(this._HandleKey);this.$input_source.keydown(this._CheckComposition);this.$input_source.bind("compositionstart",this._StartComposition);this.$input_source.bind("compositionend",function(e){return setTimeout(function(){return t._EndComposition(e)},0)});if(this.isAndroid){this.$input_source.bind("input",this._StartComposition);return this.$input_source.bind("input",this._UpdateComposition)}else{return this.$input_source.bind("text",this._UpdateComposition)}};i.prototype._HandleChar=function(t){var e;if(this.state===W||t.metaKey||t.ctrlKey){return true}e=t.which;if(e===8||e===9||e===13){return false}this.$prompt_left.text(this.$prompt_left.text()+String.fromCharCode(e));this._ScrollToEnd();return false};i.prototype._HandleKey=function(e){var i;if(this.state===W){return true}i=e.keyCode||e.which;setTimeout(t.proxy(this._CheckMatchings,this),0);if(e.altKey){return true}else if(e.ctrlKey||e.metaKey){return this._HandleCtrlShortcut(i)}else if(e.shiftKey){switch(i){case w:this._HandleEnter(true);break;case H:this._Unindent();break;case E:this._MoveUp();break;case b:this._MoveDown();break;case M:this._ScrollPage("up");break;case S:this._ScrollPage("down");break;default:return true}return false}else{switch(i){case w:this._HandleEnter(false);break;case H:this._Indent();break;case x:this._Delete(false);break;case g:this._Backspace(false);break;case T:this._MoveLeft(false);break;case P:this._MoveRight(false);break;case E:this._HistoryPrevious();break;case b:this._HistoryNext();break;case C:this.MoveToStart(false);break;case k:this.MoveToEnd(false);break;case M:this._ScrollPage("up");break;case S:this._ScrollPage("down");break;default:return true}return false}};i.prototype._HandleCtrlShortcut=function(t){var e,i,s,r;switch(t){case x:this._Delete(true);break;case g:this._Backspace(true);break;case T:this._MoveLeft(true);break;case P:this._MoveRight(true);break;case E:this._MoveUp();break;case b:this._MoveDown();break;case k:this.MoveToEnd(true);break;case C:this.MoveToStart(true);break;default:if(t in this.shortcuts){r=this.shortcuts[t];for(i=0,s=r.length;i<s;i++){e=r[i];e.call(this)}return false}else{return true}}return false};i.prototype._HandleEnter=function(t){var e,i,s=this;this._EndComposition();if(t){return this._InsertNewLine(true)}else{i=this.GetPromptText();e=function(t){var e,r,o,n,h,c;if(t!==false){s.MoveToEnd(true);s._InsertNewLine(true);c=[];for(o=n=0,h=Math.abs(t);0<=h?n<h:n>h;o=0<=h?++n:--n){if(t>0){c.push(s._Indent())}else{c.push(s._Unindent())}}return c}else{r=s.state===I?"input":"prompt";s.Write(s.GetPromptText(true)+L,""+p+"old-"+r);s.ClearPromptText(true);if(s.history_active){if(!s.history.length||s.history[s.history.length-1]!==i){s.history.push(i)}s.history_index=s.history.length}s.state=W;e=s.input_callback;s.input_callback=null;if(e){e(i)}return s._CheckInputQueue()}};if(this.multiline_callback){if(this.async_multiline){return this.multiline_callback(i,e)}else{return e(this.multiline_callback(i))}}else{return e(false)}}};i.prototype._GetDirectionals=function(e){var i,s,r,o,n,h,p,c;o=e?this.$prompt_left:this.$prompt_right;i=e?this.$prompt_right:this.$prompt_left;r=e?this.$prompt_before:this.$prompt_after;s=e?this.$prompt_after:this.$prompt_before;h=e?t.proxy(this.MoveToStart,this):t.proxy(this.MoveToEnd,this);n=e?t.proxy(this._MoveLeft,this):t.proxy(this._MoveRight,this);c=e?"last":"first";p=e?"prependTo":"appendTo";return{$prompt_which:o,$prompt_opposite:i,$prompt_relative:r,$prompt_rel_opposite:s,MoveToLimit:h,MoveDirection:n,which_end:c,where_append:p}};i.prototype._VerticalMove=function(t){var e,i,s,r,o,n,h,p;p=this._GetDirectionals(t),s=p.$prompt_which,e=p.$prompt_opposite,i=p.$prompt_relative,o=p.MoveToLimit,r=p.MoveDirection;if(i.is(f)){return}n=this.$prompt_left.text().length;o();r();h=s.text();e.text(t?h.slice(n):h.slice(0,n));return s.text(t?h.slice(0,n):h.slice(n))};i.prototype._MoveUp=function(){return this._VerticalMove(true)};i.prototype._MoveDown=function(){return this._VerticalMove()};i.prototype._HorizontalMove=function(e,i){var s,r,o,n,h,p,c,a,l,u,_,d,$,y;y=this._GetDirectionals(i),h=y.$prompt_which,r=y.$prompt_opposite,n=y.$prompt_relative,o=y.$prompt_rel_opposite,d=y.which_end,_=y.where_append;a=i?/\w*\W*$/:/^\w*\W*/;l=h.text();if(l){if(e){$=l.match(a);if(!$){return}$=$[0];u=r.text();r.text(i?$+u:u+$);c=$.length;return h.text(i?l.slice(0,-c):l.slice(c))}else{u=r.text();r.text(i?l.slice(-1)+u:u+l[0]);return h.text(i?l.slice(0,-1):l.slice(1))}}else if(!n.is(f)){p=t(m)[_](o);p.append(t(m).text(this.$prompt_label.text()));p.append(t(m).text(r.text()));s=n.children()[d]().detach();this.$prompt_label.text(s.children().first().text());h.text(s.children().last().text());return r.text("")}};i.prototype._MoveLeft=function(t){return this._HorizontalMove(t,true)};i.prototype._MoveRight=function(t){return this._HorizontalMove(t)};i.prototype._MoveTo=function(t,e){var i,s,r,o,n,h,p;h=this._GetDirectionals(e),r=h.$prompt_which,i=h.$prompt_opposite,s=h.$prompt_relative,n=h.MoveToLimit,o=h.MoveDirection;if(t){p=[];while(!(s.is(f)&&r.text()==="")){n(false);p.push(o(false))}return p}else{i.text(this.$prompt_left.text()+this.$prompt_right.text());return r.text("")}};i.prototype._Delete=function(t){var e,i,s;i=this.$prompt_right.text();if(i){if(t){s=i.match(/^\w*\W*/);if(!s){return}s=s[0];return this.$prompt_right.text(i.slice(s.length))}else{return this.$prompt_right.text(i.slice(1))}}else if(!this.$prompt_after.is(f)){e=this.$prompt_after.children().first().detach();return this.$prompt_right.text(e.children().last().text())}};i.prototype._Backspace=function(e){var i,s,r;setTimeout(t.proxy(this._ScrollToEnd,this),0);s=this.$prompt_left.text();if(s){if(e){r=s.match(/\w*\W*$/);if(!r){return}r=r[0];return this.$prompt_left.text(s.slice(0,-r.length))}else{return this.$prompt_left.text(s.slice(0,-1))}}else if(!this.$prompt_before.is(f)){i=this.$prompt_before.children().last().detach();this.$prompt_label.text(i.children().first().text());return this.$prompt_left.text(i.children().last().text())}};i.prototype._Indent=function(){var t;return this.$prompt_left.prepend(function(){var e,i,s;s=[];for(t=e=1,i=this.indent_width;1<=i?e<=i:e>=i;t=1<=i?++e:--e){s.push(" ")}return s}.call(this).join(""))};i.prototype._Unindent=function(){var t,e,i,s,r;t=this.$prompt_left.text()+this.$prompt_right.text();r=[];for(e=i=1,s=this.indent_width;1<=s?i<=s:i>=s;e=1<=s?++i:--i){if(!/^ /.test(t)){break}if(this.$prompt_left.text()){this.$prompt_left.text(this.$prompt_left.text().slice(1))}else{this.$prompt_right.text(this.$prompt_right.text().slice(1))}r.push(t=t.slice(1))}return r};i.prototype._InsertNewLine=function(e){var i,s,r;if(e==null){e=false}r=this._SelectPromptLabel(!this.$prompt_before.is(f));i=t(m).appendTo(this.$prompt_before);i.append(t(m).text(r));i.append(t(m).text(this.$prompt_left.text()));this.$prompt_label.text(this._SelectPromptLabel(true));if(e&&(s=this.$prompt_left.text().match(/^\s+/))){this.$prompt_left.text(s[0])}else{this.$prompt_left.text("")}return this._ScrollToEnd()};i.prototype._AppendPromptText=function(t){var e,i,s,r,o,n;i=t.split(L);this.$prompt_left.text(this.$prompt_left.text()+i[0]);o=i.slice(1);n=[];for(s=0,r=o.length;s<r;s++){e=o[s];this._InsertNewLine();n.push(this.$prompt_left.text(e))}return n};i.prototype._ScrollPage=function(t){var e;e=this.$container[0].scrollTop;if(t==="up"){e-=this.$container.height()}else{e+=this.$container.height()}return this.$container.stop().animate({scrollTop:e},"fast")};i.prototype._ScrollToEnd=function(){var t;this.$container.scrollTop(this.$container[0].scrollHeight);t=this.$prompt_cursor.position();this.$input_container.css({left:t.left,top:t.top});return setTimeout(this.ScrollWindowToPrompt.bind(this),50)};i.prototype.ScrollWindowToPrompt=function(){var t,e,i,s,r,o;e=this.$prompt_cursor.height();o=this.$window.scrollTop();r=this.$window.scrollLeft();t=document.documentElement.clientHeight;s=this.$prompt_cursor.offset();i=s.top-2*e;if(this.isMobile&&(typeof orientation!=="undefined"&&orientation!==null)){if(o<s.top||o>s.top){return this.$window.scrollTop(i)}}else{if(o+t<s.top){return this.$window.scrollTop(s.top-t+e)}else if(o>i){return this.$window.scrollTop(s.top)}}};i.prototype._SelectPromptLabel=function(t){if(this.state===D){if(t){return" \n"+this.prompt_label_continue}else{return this.prompt_label_main}}else{if(t){return"\n "}else{return" "}}};i.prototype._Wrap=function(t,e,i){var s,r;r=t.html();s=r.slice(0,e)+A(i,r[e])+r.slice(e+1);return t.html(s)};i.prototype._WalkCharacters=function(t,e,i,s,r){var o,n,h;n=r?t.length:0;t=t.split("");h=function(){var e,i,s,o;if(r){s=t,t=2<=s.length?U.call(s,0,i=s.length-1):(i=0,[]),e=s[i++]}else{o=t,e=o[0],t=2<=o.length?U.call(o,1):[]}if(e){n=n+(r?-1:+1)}return e};while(o=h()){if(o===e){s++}else if(o===i){s--}if(s===0){return{index:n,current_count:s}}}return{index:-1,current_count:s}};i.prototype._ProcessMatch=function(e,i,s){var r,o,n,h,p,c,a,l,u,_,f,m,d=this;_=i?[e["closing_char"],e["opening_char"]]:[e["opening_char"],e["closing_char"]],h=_[0],l=_[1];f=this._GetDirectionals(i),n=f.$prompt_which,o=f.$prompt_relative;p=1;c=false;u=n.html();if(!i){u=u.slice(1)}if(s&&i){u=u.slice(0,-1)}m=this._WalkCharacters(u,h,l,p,i),a=m.index,p=m.current_count;if(a>-1){this._Wrap(n,a,e.cls);c=true}else{r=o.children();r=i?Array.prototype.reverse.call(r):r;r.each(function(s,r){var o,n;o=t(r).children().last();u=o.html();n=d._WalkCharacters(u,h,l,p,i),a=n.index,p=n.current_count;if(a>-1){if(!i){a--}d._Wrap(o,a,e.cls);c=true;return false}})}return c};i.prototype._CheckMatchings=function(e){var i,s,r,o,n,h,p;r=e?this.$prompt_left.text().slice(this.$prompt_left.text().length-1):this.$prompt_right.text()[0];p=this.matchings.clss;for(n=0,h=p.length;n<h;n++){i=p[n];t("."+i,this.$console).contents().unwrap()}if(s=this.matchings.closings[r]){o=this._ProcessMatch(s,true,e)}else if(s=this.matchings.openings[r]){o=this._ProcessMatch(s,false,e)}else if(!e){this._CheckMatchings(true)}if(e){if(o){return this._Wrap(this.$prompt_left,this.$prompt_left.html().length-1,s.cls)}}else{if(o){return this._Wrap(this.$prompt_right,0,s.cls)}}};i.prototype._HistoryPrevious=function(){if(!this.history_active){return}if(this.history_index<=0){return}if(this.history_index===this.history.length){this.history_new=this.GetPromptText()}return this.SetPromptText(this.history[--this.history_index])};i.prototype._HistoryNext=function(){if(!this.history_active){return}if(this.history_index>=this.history.length){return}if(this.history_index===this.history.length-1){this.history_index++;return this.SetPromptText(this.history_new)}else{return this.SetPromptText(this.history[++this.history_index])}};i.prototype._CheckComposition=function(t){var e;e=t.keyCode||t.which;if(e===229){if(this.in_composition){return this._UpdateComposition()}else{return this._StartComposition()}}};i.prototype._StartComposition=function(){if(this.in_composition){return}this.in_composition=true;this._ShowComposition();return setTimeout(this._UpdateComposition,0)};i.prototype._EndComposition=function(){if(!this.in_composition){return}this._HideComposition();this.$prompt_left.text(this.$prompt_left.text()+this.$composition.text());this.$composition.text("");this.$input_source.val("");return this.in_composition=false};i.prototype._UpdateComposition=function(t){var e,i=this;e=function(){if(!i.in_composition){return}return i.$composition.text(i.$input_source.val())};return setTimeout(e,0)};i.prototype._ShowComposition=function(){this.$composition.css("height",this.$prompt_cursor.height());this.$composition.empty();return this.$composition.appendTo(this.$prompt_left)};i.prototype._HideComposition=function(){return this.$composition.detach()};return i}();t.fn.jqconsole=function(t,e,i){return new v(this,t,e,i)};t.fn.jqconsole.JQConsole=v;t.fn.jqconsole.Ansi=e}).call(this);