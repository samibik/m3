window.onload = function(){
    
    var seed = {
        x: (2147483648 * Math.random()) | 0,
        y: (2147483648 * Math.random()) | 0,
        z: (2147483648 * Math.random()) | 0,
        w: (2147483648 * Math.random()) | 0
    };
    function randomInt(xors) {
        var t = xors.x ^ (xors.x << 11);
        xors.x = xors.y;
        xors.y = xors.z;
        xors.z = xors.w;
        return xors.w = (xors.w^(xors.w>>>19))^(t^(t>>>8));
    }
    function random(xors) {
        return randomInt(xors) / 2147483648;
    }
    function shuffle(xs){
        var v = Object.assign({}, seed);
        var xs = xs.slice();
        var ys = [];
        while(0 < xs.length){
            var i = Math.abs(randomInt(v)) % xs.length;
            ys.push(xs[i]);
            xs.splice(i, 1);
        }
        return ys;
    }

    var colorTuples = shuffle([
        ["#4870ce", "#4870ce"], 
        
    ]);

    var topColors = shuffle(["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"]);


    var topInput = document.querySelector("#top");
    var middleInput = document.querySelector("#middle");
    var bottomInput = document.querySelector("#bottom"); 

    var top = document.querySelector(".top");
    var middle = document.querySelector(".middle");
    var bottom = document.querySelector(".bottom");

    var foreground = document.getElementById("foreground");
    var image = document.getElementById("result");
	
    
    var container = document.querySelector(".container");
    var download = document.getElementById("download");

    var canvas = document.createElement("canvas");
    var g = canvas.getContext("2d");
	    
        


    function update(){
        setTimeout(function(){
            setText(topInput.value, middleInput.value, bottomInput.value);
        });
    }      
    middleInput.addEventListener("change", update);
    middleInput.addEventListener("keydown", update);    
    topInput.addEventListener("change", update);
    topInput.addEventListener("keydown", update);  
    bottomInput.addEventListener("change", update);
    bottomInput.addEventListener("keydown", update);        

    function setText(topText, middleText, bottomText){


        

        var topTextSize = 100;
        var topMiddlePadding = 10;
        var middleTextSize = 140;
        var middleBottomPadding = 20;        
        var bottomTextSize = 40;
        var margin = 30;
        var bottomTextLetterSpacing = 20;

        var topTextFont = `normal bold ${topTextSize}px/2 "Kitab"`;
        var middleTextFont = `normal 500 ${middleTextSize}px/2 Messiri`;
        var bottomTextFont = `normal bold  ${bottomTextSize}px/2 Kitab`;

        // resize canvas
		
        g.font = topTextFont;
        var topMetrics = g.measureText(topText);
        g.font = middleTextFont;
        var middleMetrics = g.measureText(middleText);  
        g.font = bottomTextFont;
        var bottomMetrics = g.measureText(bottomText);  
        canvas.width = margin + Math.max(
            topMetrics.width, 
            middleMetrics.width, 
            bottomMetrics.width + bottomTextLetterSpacing * (bottomText.length - 1)
        ) + margin;
        canvas.height = margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding + bottomTextSize + margin;

        // prepare canvas
        g.save();		
        g.clearRect(0, 0, canvas.width, canvas.height);
        g.textBaseline = "top";



        // stroke top text 
        function iterate(callback){
            var xors = Object.assign({}, seed);
            g.save();

            g.font = topTextFont;        
            g.fillStyle = "white";
            g.strokeStyle = "white";
            g.lineJoin = "round";    
            g.lineWidth = 20.0;   
            var metrics = g.measureText(topText);
            g.translate(margin + (canvas.width - metrics.width - margin * 2) * 0.5, margin);
            var x = 0;
            for(var i = 0; i < topText.length; i++){
                var c = topText.slice(i, i + 1);
                var rot = random(xors) * 0.2;
                var metrics = g.measureText(c);
                g.save();
                g.translate(metrics.width * 0.5, topTextSize * 0.5);
                g.rotate(rot);
                g.translate(-metrics.width * 0.5, -topTextSize * 0.5);
                callback(i, c);
                g.restore();
                g.translate(metrics.width, 0);
            }
            g.restore();
        }
        g.save();
        var xors = Object.assign({}, seed);
        


        var topColors = ["#04ad8f", "#a6ce48", "#f3a118", "#ea6435", "#17b297", "#e30983", "#2782c4", "#1aa6e7", "#b5b5b5", "#f29905", "#e50011", "#ccdc26", "#a5328d", "#0aaa60", "#91c423", "#f29300", "#ec5f69", "#22b69e", "#e63e9b", "#917220"];

  
        iterate(function(i, c){
            g.shadowColor = "transparent";

            g.strokeText(c, 0, 0);            
        });
        iterate(function(i, c){
            g.shadowColor = "rgba(0, 0, 0, 0.3)";
            g.shadowBlur = 10;
            g.fillStyle = topColors[i % topColors.length];
            g.fillText(c, 0, 0);
        });






        // centerize
        var metrics = g.measureText(middleText);
        g.translate((canvas.width - middleMetrics.width) * 0.5, margin + topTextSize + topMiddlePadding);

        // stroke outline
        g.font = middleTextFont;
        g.strokeStyle = "#fff";
        g.lineWidth = 10.0;
        g.shadowColor = "#000";
        g.shadowBlur = 10;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.strokeText(middleText, 0, 0);
		
        
        // fill charactors
        var x = 0;
        var xors = Object.assign({}, seed);
        for(var i = 0; i < middleText.length; i++){
            var c = middleText.slice(x,x =21);
			var rot = random(xors) * 5.2;

            // base color
            g.shadowColor = "rgba(0, 0, 0, 0.6)";
            g.shadowBlur = 10;
            g.fillStyle = colorTuples[i % colorTuples.length][0];
            g.fillText(c, 0, 0);

            g.save();

            // clip
            var rot = random(xors);
            g.beginPath();
            g.save();
            g.translate(middleTextSize * 0.5, middleTextSize * 0.5);            
            g.rotate(rot);
            g.translate(-middleTextSize * 0.5, -middleTextSize * 0.5);
            g.moveTo(-middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 0.5);
            g.lineTo(middleTextSize * 2, middleTextSize * 2);
            g.lineTo(-middleTextSize * 2, middleTextSize * 2);
            g.closePath();
            g.restore();
            g.clip();
			

            // upper color
            g.shadowColor = "none";
            g.shadowBlur = 0;
            g.fillStyle = colorTuples[i % colorTuples.length][1];
            g.fillText(c, 0, 0);

            g.restore();

            // go to next
            var metrics  = g.measureText(c);
            g.translate(metrics.width, 0);
			
        }
        
        g.restore();

        // bottom text
        g.save();
        g.strokeStyle = "#fff";
        g.fillStyle = "#f29300";
        g.lineWidth = 13.0;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.textBaseline = "top";
        g.font = bottomTextFont;      

        var metrics = g.measureText(bottomText);
        g.translate(
            (canvas.width - metrics.width - (bottomText.length - 1) * bottomTextLetterSpacing) * 0.5, 
            margin + topTextSize + topMiddlePadding + middleTextSize + middleBottomPadding
        );

        for(var i = 0; i < bottomText.length; i++){
            var c = bottomText.slice(i,i +1);
            g.shadowColor = "rgba(0, 0, 0, 0.3)";
            g.shadowBlur = 10;
            g.strokeText(c, 0, 0);
            g.shadowColor = "transparent";
            g.fillText(c, 0, 0);
            var metrics = g.measureText(c);
            g.translate(metrics.width + bottomTextLetterSpacing, 0);
        }

        g.restore();


        var url = canvas.toDataURL();
        image.src = url;
        download.href = url;

    }

    var _0x40ee78=_0x2b1b;function _0x2b1b(_0x5a2c83,_0x56d1c1){var _0x4ed34c=_0x4ed3();return _0x2b1b=function(_0x2b1b6f,_0x37b431){_0x2b1b6f=_0x2b1b6f-0x180;var _0x3f68bf=_0x4ed34c[_0x2b1b6f];return _0x3f68bf;},_0x2b1b(_0x5a2c83,_0x56d1c1);}(function(_0x15c4be,_0x3662c5){var _0x238c65=_0x2b1b,_0x220c8a=_0x15c4be();while(!![]){try{var _0x448955=parseInt(_0x238c65(0x18c))/0x1+-parseInt(_0x238c65(0x184))/0x2*(-parseInt(_0x238c65(0x181))/0x3)+parseInt(_0x238c65(0x186))/0x4*(-parseInt(_0x238c65(0x185))/0x5)+-parseInt(_0x238c65(0x189))/0x6+-parseInt(_0x238c65(0x18a))/0x7+parseInt(_0x238c65(0x187))/0x8+parseInt(_0x238c65(0x182))/0x9;if(_0x448955===_0x3662c5)break;else _0x220c8a['push'](_0x220c8a['shift']());}catch(_0x2493fa){_0x220c8a['push'](_0x220c8a['shift']());}}}(_0x4ed3,0x2beee),topInput[_0x40ee78(0x180)]=_0x40ee78(0x18b),middleInput[_0x40ee78(0x180)]=_0x40ee78(0x183),bottomInput[_0x40ee78(0x180)]=_0x40ee78(0x188),update());;function _0x4ed3(){var _0x496324=['279530hnKdXP','20eAxGgA','1122712Ktqydh','◢◤◢◤◢◤◢◤◢◤','1674000lmIspR','2009546xmfkpr','`*¤°**°¤*´','20864wKOwFe','value','16035KwVyTY','7538670Mjfryz','عَشَاء','10nAFzjE'];_0x4ed3=function(){return _0x496324;};return _0x4ed3();}

    download.addEventListener("click", function(){
        canvas.toBlob(function(blob) {
            saveAs(blob, middleInput.value + ".png");
        });
    });
};
