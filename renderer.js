function renderText(){
    //get textarea value
    var text = document.getElementById("text").value;
    var lines = text.split("\n");
    var longest_line = 0;
    for (var i=0;i<lines.length;i++){
        lines[i] = lines[i].trim();
        var line = lines[i];
        if (line.length>longest_line){
            longest_line = line.length;
        }
    }
    
    //get canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var padding_top=0;
    var padding_bottom=0;
    const CHAR_SCALE=0.25;
    const CHAR_PADDING=20;
    const CHAR_WIDTH=(1000+CHAR_PADDING)*CHAR_SCALE;
    const CHAR_HEIGHT=(1000+CHAR_PADDING)*CHAR_SCALE;
    const CANVAS_WIDTH=(CHAR_WIDTH+CHAR_PADDING)*longest_line-CHAR_PADDING;
    const CANVAS_HEIGHT=(CHAR_HEIGHT+CHAR_PADDING)*lines.length+CHAR_PADDING;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.fillStyle = 'rgba(255,0,0,1)'
    //round corner and end-caps
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const THICKNESS = 50*CHAR_SCALE;
    ctx.lineWidth = THICKNESS;

    for (var line_idx=0;line_idx<lines.length;line_idx++){
        var line = lines[line_idx];
        const Y_OFFSET = (CHAR_HEIGHT+CHAR_PADDING)*line_idx;
        for (var char_idx=0;char_idx<line.length;char_idx++){
            var char = line[char_idx];
            const X_OFFSET = (CHAR_WIDTH+CHAR_PADDING)*char_idx;
            if (char in median_dict){
                var medians = median_dict[char];
                for (var i=0;i<medians.length;i++){
                    var line_coordinates = medians[i];
                    ctx.beginPath();                
                    console.log("drawing line_segment "+line_coordinates)
                    ctx.moveTo(X_OFFSET+line_coordinates[0][0]*CHAR_SCALE,Y_OFFSET+padding_top+ line_coordinates[0][1]*CHAR_SCALE);
                    for (var j=1;j<line_coordinates.length;j++){
                        ctx.lineTo(X_OFFSET+line_coordinates[j][0]*CHAR_SCALE,Y_OFFSET+padding_top+ line_coordinates[j][1]*CHAR_SCALE);
                    }
                    ctx.stroke();                                    
                }
                
                for (var i=0;i<medians.length-1;i++){        
                    var end_point = medians[i][medians[i].length-1];
                    var next_start = medians[i+1][0];
                    var midpoint = [(end_point[0]+next_start[0])/2,(end_point[1]+next_start[1])/2];
                    for (var pc=0;pc<1;pc+=0.01){
                        var radius = (1-pc)*THICKNESS/2;
                        //interpolate between end_point and midpoint
                        var x = X_OFFSET+CHAR_SCALE*(end_point[0]*(1-pc)+midpoint[0]*pc);
                        var y = Y_OFFSET+CHAR_SCALE*(end_point[1]*(1-pc)+midpoint[1]*pc);
                        //draw filled circle at x,y
                        ctx.beginPath();
                        ctx.arc(x,padding_top+y,radius,0,2*Math.PI);
                        ctx.fill();            
                    }
                }
            } else {
                //character not found. draw small x instead
                var center_x = X_OFFSET+CHAR_WIDTH/2;
                var center_y = Y_OFFSET+CHAR_HEIGHT/2;
                ctx.beginPath();
                ctx.moveTo(center_x-CHAR_WIDTH/4,center_y-CHAR_HEIGHT/4);
                ctx.lineTo(center_x+CHAR_WIDTH/4,center_y+CHAR_HEIGHT/4);
                ctx.moveTo(center_x+CHAR_WIDTH/4,center_y-CHAR_HEIGHT/4);
                ctx.lineTo(center_x-CHAR_WIDTH/4,center_y+CHAR_HEIGHT/4);
                ctx.stroke();                
            }
        }
    }
    

}