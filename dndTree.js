var count = 0;var node1,node2;var temparr = [[]];
var width=1300, height = 570;
var i=0;x_browser = 20;y_browser = 5;
var force = d3.layout.force()
            .on("tick",tick);
var tree = d3.layout.tree().size([1300, 570]);
var baseSvg;
var node,linktext,nodeEnter,images;
var startcount = 0;
/*-----------------------------------------------------------------------------------------*/
function caltypes(yolodata){
    var list= new Set();
    for(i=0;i<yolodata.length;i++){
    list.add(yolodata[i].type);
    }
    list =Array.from(list).sort();
        return list;
}
/*-----------------------------------------------------------------------------------------*/
function filetypes(yolodata){
    var list= new Set();
    for(i=0;i<yolodata.length;i++){
    list.add(yolodata[i].filename);
    }
    list =Array.from(list).sort();
    return list;
}
/*-----------------------------------------------------------------------------------------*/
function calnames(yolodata){
    var list= new Set();
    for(i=0;i<yolodata.length;i++){
    list.add(yolodata[i].name);
    }
    list = Array.from(list).sort();
    return list;
}
/*-----------------------------------------------------------------------------------------*/
function startx(){
    d3.select("h1").text(" ");
    count = 0, node1 = null; node2 = null;
    d3.select("svg").remove();
    d3.json("marvel.json", function(error, yolodata) {
    if(startcount == 0){
    var names = calnames(yolodata);
    var types = caltypes(yolodata);
    var filenames = filetypes(yolodata);
    names.forEach(function(el){
        addListEntry(el," ","searchip");
    });
    filenames.forEach(function(el){
        addListEntry(el," ","fileip");
    });
    types.forEach(function(el){
        addListEntry(el," ","aspectip");
    });
        startcount++;}
    makechildren(yolodata,0);
});
}
/*-----------------------------------------------------------------------------------------*/
function makechildren(data,identifier) {
    data.push({                           //Push main-node into position data[0] which will be hidden
    name:"main-node",
    parent:null,
    });
    var temp=data[data.length-1];
    for(var i=data.length-2;i>=0;i--){
        data[i+1]=data[i];
    }
    data[0]=temp;
/*--------------------------*/
    var found;
    for(var i=0;i<data.length;i++)        //If node.parent doesnt exist, set parent node to main-node
    {

    for(var j=0;j<data.length;j++)
        {
        if(data[i].parent==data[j].name){
            found=true;
            break;}
        else{
        found=false;
        }
        }
    if(!found)
        {
        if(data[i].name!="main-node"){
            data[i].parent = "main-node";}
        }
    }
/*--------------------------*/
    var dataMap = data.reduce(function(map, node){   //Change data so each node is identified by node.name
    map[node.name] = node;
    return map;}, {},);
    data.forEach(function(d) {
      d.color = undefined;
    })
/*--------------------------*/
    var treeData = [];                               //Create treeData with parent children format
    var i=0;
    data.forEach(function(node){
    if(node.parent==null && node.name!="main-node")
    {
        node.parent = "main-node";
        }
    // temparr[i] = new Array(node.parent,node.name);
    // i = i+1;
    var parent = dataMap[node.parent];
    if (parent) {
        (parent.children || (parent.children = []))
            .push(node);
    } else {
        treeData.push(node);
    }
    console.log(treeData);
/*--------------------------*/
    if(node.type == "Organization")                 //Add images to nodes
    {
      node.img="https://cdn0.iconfinder.com/data/icons/project-management-flat-circular/128/8-512.png";
      treeData.push(node);
    }
    else if(node.type == "Department")
    {
      node.img="https://artscimedia.case.edu/wp-content/uploads/sites/79/2017/10/20181806/briefcase-flat-vector-icon-e1508523524640.png";
      treeData.push(node);
    }
    else if(node.type == "System")
    {
      node.img="https://www.freeiconspng.com/uploads/displaying-14-images-for--customer-service-icon-png-23.png";
      treeData.push(node);
    }
    else if(node.type == "Service")
    {
      node.img="https://www.solarserviceguys.com.au/wp-content/uploads/2018/07/SSGUYS-Home-Icons-Solar-Service.png";
      treeData.push(node);
    }
     else if(node.type == "API")
    {
      node.img="https://cdn2.iconfinder.com/data/icons/web-design-development-ui-vol-2-1/96/Api_app_coding_computer_development_settings_software-512.png";
      treeData.push(node);
    }
     else if(node.type == "Port")
    {
      node.img="https://cdn1.iconfinder.com/data/icons/devices-circular-3/90/103-512.png";
      treeData.push(node);
    }
     else if(node.type == "Path")
    {
      node.img="https://secure.webtoolhub.com/static/resources/icons/set51/54a1d706.png";
      treeData.push(node);
    }
     else if(node.type == "Operation")
    {
      node.img="http://absstem.com/wp-content/uploads/2017/11/automatic-system-ICON.png";
      treeData.push(node);
    }
     else if(node.type == "Parameter")
    {
      node.img="https://cdn4.iconfinder.com/data/icons/office-20/128/office-94-512.png";
      treeData.push(node);
    }
    else if(node.type == "Request")
    {
      node.img="https://www.freeiconspng.com/uploads/blue-circle-png-5.png";
      treeData.push(node);
    }
    else if(node.type == "Response")
    {
      node.img="https://cdn0.iconfinder.com/data/icons/basic-11/97/46-512.png";
      treeData.push(node);
    }
    else if(node.type == "Method")
    {
      node.img="http://iconsetc.com/icons-watermarks/flat-circle-white-on-green-gradient/classica/classica_curly-bracket/classica_curly-bracket_flat-circle-white-on-green-gradient_512x512.png";
      treeData.push(node);
    }
    });
/*--------------------------*/
    if(identifier==0){                         //Identifier for makegraph() and other return functions
        makegraph(treeData);
        treeData.forEach(function(d){
        })
    }
    else if (identifier==1)
       { return treeData;}
    }
/*-----------------------------------------------------------------------------------------*/
function makegraph(data){
    //Create svg
baseSvg = d3.select("#svgcontent").append("svg").on("contextmenu", function (d, i) {d3.event.preventDefault();})
    .attr("width",1300)
    .attr("height",570)
    .style("background-color","#eee")
    .call(zoom)
    baseSvg = baseSvg.append("g");
    root=data[0];
    update(root);
}
/*-----------------------------------------------------------------------------------------*/
function update(source) {
    nodes = tree.nodes(root)                                         // Compute the new tree layout
    links = tree.links(nodes);
/*--------------------------*/
    force.nodes(nodes)                                               // Force layout parameters
    .links(links)
    .gravity(0.05)
    .charge(-5000)
    .linkDistance(200)
    .friction(0.3)
    .linkStrength(function(l, i) {return 1; })
    .size([1300, 570])
    .start();
/*--------------------------*/
    node = baseSvg.selectAll(".node")                                     // Declare the nodes
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
    link = baseSvg.selectAll(".link")                                     // Declare the paths
        .data(links, function(d) {return d.target.id; });
/*--------------------------*/
    nodeEnter = node.enter().append("g")                                   // Enter the nodes.
    .attr("class", function(d){
    return 'node level-'+d.depth; // add the node depth
    })
    .attr("transform", function(d) {
    return "translate(" + d.y + "," + d.x + ")"; })
    .on("click", click)
    .on("contextmenu",rightclick)
    /*.on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("transform",nodeTransform)
              .attr("height", 100)
              .attr("width", 100);
          })
          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -25;})
              .attr("y", function(d) { return -25;})
              .attr("height", 50)
              .attr("width", 50);
          });*/
    createObjects(nodeEnter);
}
/*-----------------------------------------------------------------------------------------*/
function createObjects(nodeEnter){
    nodeEnter.append("circle")                  //node properties
        .attr("r", 10)
        .style("fill", "white")
/*--------------------------*/
    images = nodeEnter.append("image","g")      //Image properties
        .attr("class", "icon")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50)
/*--------------------------*/
    nodeEnter.append("text")                     //Nodetext properties
        .attr("class", "nodetext")
        .attr("x", x_browser)
        .attr("y", y_browser +15)
        .attr("fill", "black")
        .text(function(d) { return d.name; });
/*--------------------------*/
    link.enter().insert("path","g")              // Declare the links
        .attr("class", function(d){
        return 'link level-' + d.source.depth})
        .style("stroke", "grey")
        .style("stroke-width",1)
/*--------------------------*/
    linktext = baseSvg.selectAll("g.linklabelholder").data(links);  //Declare linktext
    linktext.enter().append("g").attr("class", "linklabelholder")   //Linktext properties
        .append("text")
        .attr("class", function(d){
        return 'linktext level-' + d.source.depth})
        .attr("dx", 1)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.target.type });
}
/*-----------------------------------------------------------------------------------------*/
function tick(){
        link.attr("d", function(d) {                            //Link changes
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            //dr =  Math.sqrt(dx * dx + dy * dy);
            dr = 0;
                return   "M" + d.source.x + ","
                + d.source.y
                + "A" + dr + ","
                + dr + " 0 0,1 "
                + d.target.x + ","
                + d.target.y;
});
/*    force.start();
*/    node.attr("transform", nodeTransform);                      //Node changes,call nodeTransform
    linktext.attr("transform", function(d) {                    //Linktext changes
    return "translate(" + (d.source.x + d.target.x) / 2 + ","
    + (d.source.y + d.target.y) / 2 + ")"; });
}
/*-----------------------------------------------------------------------------------------*/
function nodeTransform(d){

    return "translate(" + d.x + "," + d.y + ")";
}
/*-----------------------------------------------------------------------------------------*/
function click(){
  if(this.selected != true)
  {
    if(count<2){
    count ++;
    d3.select(this)
        this.selected = true;
        // console.log(d3.select(this));
    var a=d3.select(this).data()[0];
    if (count==1)
    node1=a;
    if (count==2)
    node2=a;
    d3.select(this).select("text").transition()
        .duration(750)
        .attr("x", 22)
        .style("fill", "black")
        .style("stroke", "steelblue")
        .style("stroke-width", "1px")
        .style("font", "50px sans-serif");
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 100)
    }
}
}
/*-----------------------------------------------------------------------------------------*/
function rootpath(){
    if(count==1){
    node2 = d3.selectAll(".node").filter(function(d) { return d.name === "main-node" });
    count = 2;
    path();}
}
/*-----------------------------------------------------------------------------------------*/
function neighbours(){
    var neighbours=[];
    neighbours.push(node1);
    links.forEach(function(d){
        if(d.source == node1){
        d.target.neighbour = true;
        neighbours.push(d.target);
        }
    neighbours[0].neighbour=true;
    })
    neighbourRestroke();
}
/*-----------------------------------------------------------------------------------------*/
function restroke(id,common){
// Colours selected path between 2 nodes
    if(id==0){
    if (count==1){
    link.attr("color",function(d){
     if (d.target.color) {
            return d.target.color;  //Initially undefined. Will return steelblue
          } else {
            return "undefined"
          }
    })
    }
    else if(count==2){
    d3.selectAll(".link").style("stroke", function(d) {
          if (d.target.color) {
            return d.target.color;  //Initially undefined. Will return steelblue
          } else {
            return "undefined"
          }
        })
    d3.selectAll(".link").style("stroke-width", function(d) {
          if (d.target.color == "steelblue"){
            return 15;//if the value is set
          }else{
            return 1
          }
        })
        }
    }
    if(id == 1){
    d3.selectAll(".link").style("stroke", function(d) {
          if (d.target.color) {
            return d.target.color;  //Initially undefined. Will return steelblue
          } else {
            return "undefined"
          }
        })
    d3.selectAll(".link").style("stroke-width", function(d) {
          if (d.target.color == "steelblue"){
            return 15;//if the value is set
          }else{
            return 1
          }

    })
}
    var commonz = d3.selectAll(".node").filter(function(d){return d == common})
    commonz.attr("class","stroked");
    var theNode = d3.selectAll(".node").filter(function(d){return d.color != "steelblue"});
    theNode.attr("class","nonstroked")
    var theLink = d3.selectAll(".link").filter(function(d){return d.target.color != "steelblue" });
    theLink.attr("class","nonstroked")
    var theText = d3.selectAll(".linktext").filter(function(d){return d.target.color != "steelblue"});
    theText.attr("class","nonstroked")

}
/*-----------------------------------------------------------------------------------------*/
function neighbourRestroke(){
//Toggles visibility of Neighbours and non Neighbours
if(node1.parent.name!="main-node"){
var theNode = d3.selectAll(".node").filter(function(d) { return d == node1.parent });
theNode.attr("class","neighbours");}
d3.selectAll(".node").attr("class", function(d) {
          if (d.neighbour == true) {
            return "neighbours";  //Initially undefined. Will return steelblue
          } else {
            return "non-neighbours"
          }
        })

d3.selectAll(".link").attr("class", function(d) {
          if (d.target.neighbour == true && d.source.name!="main-node") {
            return "neighbours";  //Initially undefined. Will return steelblue
          } else {
            return "non-neighbours"
          }
        })
d3.selectAll(".link").attr("class", function(d) {
          if (d.source.neighbour == true) {
            return "neighbours";  //Initially undefined. Will return steelblue
          } else {
            return "non-neighbours"
          }
        })
d3.selectAll(".linktext").attr("class", function(d) {
          if (d.target.neighbour == true && d.source.name!="main-node") {
            return "neighbours";  //Initially undefined. Will return steelblue
          } else {
            return "non-neighbours"
          }
        })
}
/*-----------------------------------------------------------------------------------------*/
function search(){
    // Search Function
    var ipname = document.getElementById("bsearchip").value;
    var theNode = d3.selectAll(".node").filter(function(d) { return d.name === ipname });
    theNode.select("text").transition()
        .duration(750)
        .attr("x", 22)
        .style("fill", "black")
        .style("stroke", "red")
        .style("stroke-width", "1px")
        .style("font", "50px sans-serif");
    theNode.select("circle").transition()
        .duration(750)
        .attr("r", 50)
}
/*-----------------------------------------------------------------------------------------*/
function aspect(){
    var ipname = document.getElementById("baspectip").value;
    var theLinks = d3.selectAll(".link").filter(function(d) { return (d.target.type == ipname || d.source.type == ipname) && d.source.name!="main-node"});
    theLinks.attr("class","aspected");
    var theText = d3.selectAll(".linktext").filter(function(d) { return (d.target.type == ipname || d.source.type == ipname) && d.source.name!="main-node"});
    theText.attr("class","links.aspected");

    var xNode = d3.selectAll(".node").filter(function(d) { return d.type == ipname });
    for(i=0;i<xNode.data().length;i++){
        if(xNode.data()[i].parent.name!="main-node"){
        xNode.data()[i].parent.aspected=true;}
        if(xNode.data()[i].children){
        var childrenz = xNode.data()[i].children;
        childrenz.forEach(function(d){
        d.aspected = true;
        })}
        }

    var nodeparents = d3.selectAll(".node").filter(function(d){return d.aspected == true });
    nodeparents.attr("class","aspected");

    var theNode = d3.selectAll(".node").filter(function(d) { return d.type != ipname });
    theNode.attr("class","nonaspected");

    xNode.select("text").transition()
        .duration(750)
        .attr("x", 22)
        .style("fill", "black")
        .style("stroke", "red")
        .style("stroke-width", "1px")
        .style("font", "50px sans-serif");
    xNode.select("circle").transition()
        .duration(750)
        .attr("r", 50)

    d3.selectAll(".link")
        .attr("class","nonaspected");
    d3.selectAll(".linktext")
        .attr("class","nonaspected");
}
/*-----------------------------------------------------------------------------------------*/
function zoomed() {
    baseSvg.attr("transform",
        "translate(" + zoom.translate() + ")" +
        "scale(" + zoom.scale() + ")"
    );
}
/*-----------------------------------------------------------------------------------------*/
function rightclick(){
    if(this.selected == true)
    {
        if (count!=0){
        if(count == 2)
            node2 = null;
        if(count ==1)
            node1 = null;
        count --;
        d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 6)
        .style("fill", "#ccc");
        d3.select(this).select("text").transition()
        .duration(750)
        .attr("x", 12)
        .style("stroke", "none")
        .style("fill", "black")
        .style("stroke", "none")
        .style("font", "10px sans-serif");
        }
    d3.select(this)
        .attr("class","node")
    }
}
/*-----------------------------------------------------------------------------------------*/
function path(){
    var bnode1 = document.getElementById("bnode1").value;
    var bnode2 = document.getElementById("bnode2").value;
    if(bnode1.length!=0 && bnode2.length!=0){
    count = 2;
    bnode1=d3.selectAll(".node").filter(function(d){return d.name == bnode1});
    bnode2=d3.selectAll(".node").filter(function(d){return d.name == bnode2});
    node1=bnode1.data()[0];
    node2=bnode2.data()[0];
    }
    var names = [];var names2 = [];var common =[];

    var find;
    if(count==2){
    find=node1;
    while (find.parent){
        if(find.color == "steelblue"){
            find.color = "undefined";
            names.push(find);
            find=find.parent;}
        else{
            find.color = "steelblue";
            names.push(find);
            find = find.parent;}
    }
    find=node2;
    while (find.parent){
        if(find.color == "steelblue"){
            names2.push(find);
            find.color = "undefined";
            find=find.parent;}
        else{
            names2.push(find);
            find.color = "steelblue";
            find = find.parent;}
    }
    for(i=0;i<names.length;i++)
    {
        for(j=0;j<names2.length;j++)
        {
            if(names[i]==names2[j])
            {
            common.push(names[i]);
            break;
            }
        }
    }

    if(common.length==0 && names2.length!=0){
    d3.select("h1").text("No path between two trees!");
    }
    else{
    force
    .linkDistance(500)
    .start();
    restroke(0,common[0]);}}
}
/*-----------------------------------------------------------------------------------------*/
function addListEntry(value, text,idtf) {
        var optionNode =  document.createElement("option");
        optionNode.value = value;
        optionNode.appendChild(document.createTextNode(text));
        document.getElementById(idtf).appendChild(optionNode);
    }
/*-----------------------------------------------------------------------------------------*/
function removeduplicates(){
  d3.select("svg").remove();
  arr2= [];
    d3.json("marvel.json", function(error, yolodata) {

for(i=0;i<yolodata.length;i++)
{
  flag =0;
  for(j=i+1;j<yolodata.length;j++)
  {
    str1 = JSON.stringify(yolodata[i]);
    str2 = JSON.stringify(yolodata[j]);
    if(str1==str2)
    {
      flag = 1;
      break;
    }
  }
  if(flag==0)
  {
    arr2.push(yolodata[i]);
  }
}
    makechildren(arr2,0);
});
  }
/*-----------------------------------------------------------------------------------------*/
function filetrees(){
    var ipname = document.getElementById("bfileip").value;
    var dLinks = d3.selectAll(".link").filter(function(d) { return d.target.filename != ipname || d.source.filename != ipname});
    dLinks.attr("class","nonaspected");
    var dLinktext = d3.selectAll(".linktext").filter(function(d) { return d.target.filename != ipname || d.source.filename != ipname});
    dLinktext.attr("class","nonaspected");
    var theLinks = d3.selectAll(".link").filter(function(d) { return (d.target.filename == ipname || d.source.filename == ipname) && d.source.name!="main-node"});
    theLinks.attr("class","aspected");
    var theText = d3.selectAll(".linktext").filter(function(d) { return (d.target.filename == ipname || d.source.filename == ipname) && d.source.name!="main-node"});
    theText.attr("class","links.aspected");



    var xNode = d3.selectAll(".node").filter(function(d) { return d.filename == ipname });
/*    for(i=0;i<xNode.data().length;i++){
     *//*   if(xNode.data()[i].parent.name!="main-node"){
        xNode.data()[i].parent.aspected=true;}*//*
        if(xNode.data()[i].children){
        var childrenz = xNode.data()[i].children;
        childrenz.forEach(function(d){
        d.aspected = true;
        })}
        }*/
/*
    var nodeparents = d3.selectAll(".node").filter(function(d){return d.aspected == true });
    nodeparents.attr("class","aspected");*/

    var theNode = d3.selectAll(".node").filter(function(d) { return d.filename != ipname });
    theNode.attr("class","nonaspected");


    d3.selectAll(".link")
        .attr("class","nonaspected");
    d3.selectAll(".linktext")
        .attr("class","nonaspected");
}



var width = 960,
    height = 500;

var randomX = d3.random.normal(width / 2, 80),
    randomY = d3.random.normal(height / 2, 80);

var data = d3.range(2000).map(function() {
    return [randomX(), randomY() ];
});

var zoom = d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", zoomed);


function zoomClick() {
    var clicked = d3.event.target,
        direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    d3.event.preventDefault();
    direction = (this.id === 'zoom_in') ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
}

function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
            iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
            zoom
                .scale(iScale(t))
                .translate(iTranslate(t));
            zoomed();
        };
    });
}

function zoomed() {
    baseSvg.attr("transform",
        "translate(" + zoom.translate() + ")" +
        "scale(" + zoom.scale() + ")"
    );
}


    var select = d3.select("body")
      .append("input")
      .attr("type","button")
      .attr('id','zoom_in')
      .attr("value","+")
      .on('click',zoomClick);

    var select = d3.select("body")
      .append("input")
      .attr("type","button")      
      .attr('id','zoom_out')
      .attr("value","-")      
      .on('click',zoomClick);



