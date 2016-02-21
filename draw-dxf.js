function processDXF(data) {
    console.log("Inside Processdxf: ", data);
    //console.log(" If I am right this is the one running now - from renderer.js pulled in via requirejs "); // want to see it clearly
    var i, entity;

    for (i = 0; i < data.entities.length; i++) {
        entity = data.entities[i];

        if (entity.type === 'DIMENSION') {
            if (entity.block) {
                var block = data.blocks[entity.block];
                for (j = 0; j < block.entities.length; j++) {
                   drawEntity(block.entities[j], data);
                    //console.log('Sending DXF data to drawEntity function...');
                }
            }
            else {
                console.log('WARNING: No block for DIMENSION entity');
            }
        }
        else {
            drawEntity(entity, data);
            //console.log("Running drawEntity for ", entity, " which is ", data);
        }
    }
}

function drawEntity(entity, data) {
    console.log("inside drawEntity function now to process Entity: ", entity);

    const visual = undefined
    if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
        visual = makeCircle(entity, data);
    }
    else if (entity.type === 'LWPOLYLINE' || entity.type === 'LWPOLYLINE' || entity.type === 'LINE') {
        visual = makeLine(entity, data);
    }
    else if (entity.type === 'TEXT') {
        visual = makeText(entity, data);
    }
    else if (entity.type === 'SOLID') {
        visual = makeSolid(entity, data);
    }
    else if (entity.type === 'POINT') {
        visual = makePoint(entity, data);
    }

    this.sceneAdd(visual)
}

//function getColor(entity, data) {
//  var color = entity.color || data.tables.layers[entity.layer].color;
//  if(color === 0xffffff) {
//    color = 0x000000;
//  }
//  return color;
//}

function getColor(entity, data) {
    //var color = entity.color || data.tables.layers[entity.layer].color;
    //  if(color === 0xffffff) {
    //    color = 0x000000;
    //}
    return 0x000099
}


function makeLine(entity, data) {
    var geometry = new THREE.Geometry(),
        color = getColor(entity, data),
        material, lineType, vertex, startPoint, endPoint, bulgeGeometry,
        bulge, i, line;

    // create geometry
    for (i = 0; i < entity.vertices.length; i++) {

        if (entity.vertices[i].bulge) {
            bulge = entity.vertices[i].bulge;
            startPoint = entity.vertices[i];
            endPoint = i + 1 < entity.vertices.length ? entity.vertices[i + 1] : geometry.vertices[0];

            bulgeGeometry = new THREE.BulgeGeometry(startPoint, endPoint, bulge);

            geometry.vertices.push.apply(geometry.vertices, bulgeGeometry.vertices);
        }
        else {
            vertex = entity.vertices[i];
            geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, 0));
        }

    }
    if (entity.shape) geometry.vertices.push(geometry.vertices[0]);


    // set material
    //if(entity.lineType) {
    //  lineType = data.tables.lineTypes[entity.lineType];
    //}

    if (lineType && lineType.pattern && lineType.pattern.length !== 0) {
        material = new THREE.LineDashedMaterial({
            color: color,
            gapSize: 4,
            dashSize: 4
        });
    }
    else {
        material = new THREE.LineBasicMaterial({
            linewidth: 1,
            color: color
        });
    }

    // if(lineType && lineType.pattern && lineType.pattern.length !== 0) {

    //           geometry.computeLineDistances();

    //           // Ugly hack to add diffuse to this. Maybe copy the uniforms object so we
    //           // don't add diffuse to a material.
    //           lineType.material.uniforms.diffuse = { type: 'c', value: new THREE.Color(color) };

    // 	material = new THREE.ShaderMaterial({
    // 		uniforms: lineType.material.uniforms,
    // 		vertexShader: lineType.material.vertexShader,
    // 		fragmentShader: lineType.material.fragmentShader
    // 	});
    // }else {
    // 	material = new THREE.LineBasicMaterial({ linewidth: 1, color: color });
    // }

    line = new THREE.Line(geometry, material);
    //line.translateX(laserxmax /2 * -1);
    //line.translateY(laserymax /2 * -1);

    console.log("Scene Add Line ");
    return line
},

function makeCircle(entity, data) {

    // Laserweb - calc and draw gcode
    var radius = entity.radius;
    console.log('Radius:' + radius + ' and Center ' + entity.center.x + ',' + entity.center.y + ',' + entity.center.z + ',\n'); // Radius:220 and Center 0,0,0,
    var arcTotalDeg = entity.startAngleDeg - entity.endAngleDeg;
    console.log('Start Angle: ' + entity.startAngleDeg + ', End Angle: ' + entity.endAngleDeg + ', thus spanning ' + arcTotalDeg + 'deg');

    // Do some math here, to determine starting point (using center, Radius and start angle?)
    // Do some math here, to determine starting point (using  center, Radius and End angle?)
    // Do some math here, to draw line segments (sections spaced radius away from center, from start point to end point (lengh of segment is number of segments divide by arcTotalDeg)?)
    // Write that to GCODE
    // end Laserweb

    // Draw it since its cool to see (note this is a straigh three.js view of it, not via gcode.  Can be used in the Cutting Params view by coloring object/layers to change params)
    var geometry, material, circle;

    geometry = new THREE.CircleGeometry(entity.radius, 32, entity.startAngle, entity.angleLength);
    geometry.vertices.shift();

    material = new THREE.LineBasicMaterial({
        color: getColor(entity, data)
    });

    circle = new THREE.Line(geometry, material);
    circle.position.x = entity.center.x;
    circle.position.y = entity.center.y;
    circle.position.z = entity.center.z;
    //circle.translateX(laserxmax /2 * -1);
    //circle.translateY(laserymax /2 * -1);
    console.log("Scene Add Circle")
    return circle
}

function makeSolid(entity, data) {
    console.log("inside makeSolid function now...");
    var material, mesh, solid, verts;
    geometry = new THREE.Geometry();

    verts = geometry.vertices;
    verts.push(new THREE.Vector3(entity.points[0].x, entity.points[0].y, entity.points[0].z));
    verts.push(new THREE.Vector3(entity.points[1].x, entity.points[1].y, entity.points[1].z));
    verts.push(new THREE.Vector3(entity.points[2].x, entity.points[2].y, entity.points[2].z));
    verts.push(new THREE.Vector3(entity.points[3].x, entity.points[3].y, entity.points[3].z));

    // Calculate which direction the points are facing (clockwise or counter-clockwise)
    var vector1 = new THREE.Vector3();
    var vector2 = new THREE.Vector3();
    vector1.subVectors(verts[1], verts[0]);
    vector2.subVectors(verts[2], verts[0]);
    vector1.cross(vector2);

    // If z < 0 then we must draw these in reverse order
    if (vector1.z < 0) {
        geometry.faces.push(new THREE.Face3(2, 1, 0));
        geometry.faces.push(new THREE.Face3(2, 3, 0));
    }
    else {
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 3, 2));
    }


    material = new THREE.MeshBasicMaterial({
        color: getColor(entity, data)
    });

    mesh = new THREE.Mesh(geometry, material);

    //mesh.translateX(laserxmax /2 * -1);
    //mesh.translateY(laserymax /2 * -1);
    console.log("Scene Add Mesh")
    return mesh
}

function makeText(entity, data) {
    console.log("inside drawText function now...");
    var geometry, material, text;

    geometry = new THREE.TextGeometry(entity.text, {
        height: 0,
        size: entity.textHeight || 12
    });

    material = new THREE.MeshBasicMaterial({
        color: getColor(entity, data)
    });

    text = new THREE.Mesh(geometry, material);
    text.position.x = entity.startPoint.x;
    text.position.y = entity.startPoint.y;
    text.position.z = entity.startPoint.z;

    //text.translateX(laserxmax /2 * -1);
    //text.translateY(laserymax /2 * -1);
    console.log("Scene Add Mesh")
    return text
}

function makePoint(entity, data) {
    console.log("inside drawPoint function now...");
    var geometry, material, point;

    geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(entity.position.x, entity.position.y, entity.position.z));

    // TODO: could be more efficient. PointCloud per layer?

    var numPoints = 1;

    var color = getColor(entity, data);
    var colors = new Float32Array(numPoints * 3);
    colors[0] = color.r;
    colors[1] = color.g;
    colors[2] = color.b;

    geometry.colors = colors;
    geometry.computeBoundingBox();

    material = new THREE.PointCloudMaterial({
        size: 0.05,
        vertexColors: THREE.VertexColors
    });
    point = new THREE.PointCloud(geometry, material);

    //point.translateX(laserxmax /2 * -1);
    //point.translateY(laserymax /2 * -1);
    console.log("Scene Add Point")
    return point
}
