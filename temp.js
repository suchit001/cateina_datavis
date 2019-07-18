var count = 0;
var node1,node2;
var temparr = [[]];
var allrootarr = [];
var temp1=0,temp2=0;
var arr2 = [[]]
function startx(){
  d3.select("svg").remove();
    d3.json("marvel.json", function(error, yolodata) {
arr2[0] = yolodata [0];
temp1++;
temp2++;

    makechildren(yolodata);
});
}
//-----------------------------------------------------------------------------------------/
function makechildren(data) {

data.push({
    name:"main-node",
    parent:null,
    type : "Organization",
    });
    var temp=data[data.length-1];
    for(var i=data.length-2;i>=0;i--){
        data[i+1]=data[i];
    }
    data[0]=temp;

    var found;
    for(i=0;i<data.length;i++)
    {
    for(j=0;j<data.length;j++)
        {
        if(data[i].parent==data[j].name){
            found=true;
            break;
        }
        else{
            found=false;
        }
    }
    if(!found)
        {
          if(data[i].name != 'main-node'){
        data[i].parent = "main-node";}
        }
    }


    var dataMap = data.reduce(function(map, node) {
    map[node.name] = node;
    return map;}, {},);





    var treeData = [];
    var i=0;
    // create the tree array

    data.forEach(function(node){
    temparr[i] = new Array(node.parent,node.name);
    i =i+1;
    // add to parent
    var parent = dataMap[node.parent];
    if (parent) {
        // create child array if it doesn't exist
        (parent.children || (parent.children = []))
        // add node to child array
            .push(node);
    } 
    else {
        // parent is null or missing
        treeData.push(node);
    }

    if(parent==null){
      allrootarr.push(node);
    }

    if(node.type == "Organization")
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
      node.img="http://chittagongit.com/download/84314";
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
    makegraph(treeData);

    }
/-----------------------------------------------------------------------------------------/
function makegraph(data){
    var margin = {top: 20, right: 120, bottom: 20, left: 120}
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

    var i = 0;
    var w = 1360;
    h = 800;
    x_browser = 20;
    y_browser = 5;
    var force = d3.layout.force();

    var viewerWidth = 1000;
    var viewerHeight = 2000;

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    function zoom()
    { baseSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); }

    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });

var baseSvg = d3.select("#svgcontent").append("svg")
    .attr("width",1360)
    .attr("height",960)
    .style("background-color","#eee")
    .call(zoomListener)
    .on("contextmenu", function (d, i) {
            d3.event.preventDefault();
        });
var baseSvg = baseSvg.append("g");


root =data[0];
update(root);

function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root)
    links = tree.links(nodes);

    force.nodes(nodes)
    .links(links)
    .gravity(0.05)
    .charge(-5000)
    .linkDistance(200)
    .friction(0.5)
    .linkStrength(function(l, i) {return 1; })
    .size([w, h])
    .on("tick", function tick() {
    path.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr =  Math.sqrt(dx * dx + dy * dy);
        dr = 0;
            return   "M" + d.source.x + ","
            + d.source.y
            + "A" + dr + ","
            + dr + " 0 0,1 "
            + d.target.x + ","
            + d.target.y;
    });
    nodetexttick(node,linktext);
    })
    .start();




    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 200; });

    // Declare the nodes
    var node = baseSvg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")"; })
        .on("click", click)
        .on("contextmenu", function(){
          if(d3.select(this).attr("class") == "selected")
          {
    if (count!=0)
{
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
        })
        .call(force.drag);

    nodeEnter.append("circle")
        .attr("r", 10)
        .style("fill", "#fff");

    var images = nodeEnter.append("svg:image")
        .attr("class", "icon")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50)

    nodeEnter.append("text")
        .attr("class", "nodetext")
        .attr("x", x_browser)
        .attr("y", y_browser +15)
        .attr("fill", "black")
        .text(function(d) { return d.name; });



    // Declare the links
    var path = baseSvg.selectAll("path.link")
        .data(links, function(d) {return d.target.id; });


drawpath(path);

        var linktext = baseSvg.selectAll("g.linklabelholder").data(links);
    linktext.enter().append("g").attr("class", "linklabelholder")
        .append("text")
        .attr("class", "linklabel")
        .attr("dx", 1)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.target.value });
}
}
/-----------------------------------------------------------------------------------------/
function updateData(){

d3.json("marvel.json", function(error, data){
function paths({ temparr = [], from, to }, path = []) {
    const linkedNodes = memoize(nodes.bind(null, temparr));
    return explore(from, to);

    function explore(currNode, to, paths = []) {
        path.push(currNode);
        for (let linkedNode of linkedNodes(currNode)) {
            if (linkedNode === to) {
                let result = path.slice(); // copy values
                result.push(to);
                paths.push(result);
                continue;
            }
            // do not re-explore edges
            if (!hasEdgeBeenFollowedInPath({
                    edge: {
                        from: currNode,
                        to: linkedNode
                    },
                    path
                })) {
                explore(linkedNode, to, paths);
            }
        }
        path.pop(); // sub-temparr fully explored
        return paths;
    }
}
function nodes(temparr, node) {
    return temparr.reduce((p, c) => {
        (c[0] === node) && p.push(c[1]);
        return p;
    }, []);
}
function hasEdgeBeenFollowedInPath({ edge, path }) {
    var indices = allIndices(path, edge.from);
    return indices.some(i => path[i + 1] === edge.to);
}
function allIndices(arr, val) {
    var indices = [],
        i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            indices.push(i);
        }
    }
    return indices;
}
function memoize(fn) {
    const cache = new Map();
    return function() {
        var key = JSON.stringify(arguments);
        var cached = cache.get(key);
        if (cached) {
            return cached;
        }
        cached = fn.apply(this, arguments)
        cache.set(key, cached);
        return cached;;
    };
}
var testpath = paths({
    temparr,
    from: node1,
    to: node2
});

var flatpath=testpath[0];
var c=0;
var newData=[[]];
    for(var i=0;i<data.length;i++)
    {
        if(flatpath[c] == data[i].name){
            newData[c]=data[i];
            c++;
            if(c==flatpath.length)
            break;
        }
    }
    d3.select("svg").remove();
    makechildren(newData);
});
}
//-----------------------------------------------------------------------------------------/
function click() {
    if(count<2){
    count ++;
    d3.select(this)
        .attr("class","selected")
    var a=d3.select(this).data()[0];
    if (count==1)
    node1=a.name;
    if (count==2)
    node2=a.name;
    d3.select(this).select("text").transition()
        .duration(750)
        .attr("x", 22)
        .style("fill", "black")
        .style("stroke", "red")
        .style("stroke-width", "1px")
        .style("font", "50px sans-serif");
    d3.select(this).select("circle").transition()
        .duration(750)
        .attr("r", 50)
    }
}

function singleaspect(){

d3.json("marvel.json", function(error, data){

var flatpath=node1;
var c=0;
var newData=[[]];
    for(var i=0;i<data.length;i++)
    {
        if(flatpath == data[i].name) {
            newData[c]=data[findindex(data[i].parent,data)];
            c++;            
            newData[c]=data[i];
            c++;
        }
        if (flatpath == data[i].parent){
            newData[c]=data[i];
            c++;
        }
    }
    d3.select("svg").remove();
    makechildren(newData);
});

}

function findindex(nodename,data){
  data.forEach(function(node,index){
    if(node.name==nodename)
    {
      indi = index;
    }
  });
  return indi;
}

function search(){
    var ipname = document.getElementById("searchbar").value;
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

function drawpath(path){
    path.enter().insert("svg:path")
        .attr("class", "link")
        .style("stroke", "#ccc")
        .style("stroke-width",3)
}

function nodeTransform(d) {
    return "translate(" + d.x + "," + d.y + ")";
    }

function nodetexttick(node,linktext){
      node.attr("transform", nodeTransform);
    linktext.attr("transform", function(d) {
    return "translate(" + (d.source.x + d.target.x) / 2 + ","
    + (d.source.y + d.target.y) / 2 + ")"; });
}


Organization: https://cdn0.iconfinder.com/data/icons/project-management-flat-circular/128/8-512.png
Deptartment: https://artscimedia.case.edu/wp-content/uploads/sites/79/2017/10/20181806/briefcase-flat-vector-icon-e1508523524640.png
System: https://www.freeiconspng.com/uploads/displaying-14-images-for--customer-service-icon-png-23.png
Service: https://www.solarserviceguys.com.au/wp-content/uploads/2018/07/SSGUYS-Home-Icons-Solar-Service.png
API: http://chittagongit.com/download/84314
Port: https://cdn1.iconfinder.com/data/icons/devices-circular-3/90/103-512.png
Path: https://secure.webtoolhub.com/static/resources/icons/set51/54a1d706.png
Operation: http://absstem.com/wp-content/uploads/2017/11/automatic-system-ICON.png 
Parameter: https://cdn4.iconfinder.com/data/icons/office-20/128/office-94-512.png

Request: https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/write-circle-blue-512.png
Response:https://cdn0.iconfinder.com/data/icons/basic-11/97/46-512.png
Method: http://iconsetc.com/icons-watermarks/flat-circle-white-on-green-gradient/classica/classica_curly-bracket/classica_curly-bracket_flat-circle-white-on-green-gradient_512x512.png

Path Algorithm: https://codereview.stackexchange.com/questions/125331/finding-all-paths-between-nodes-in-a-graph

Search Bar
Duplicity
MongoDB
URL 

Single Aspect 
Independent Path


4Frames




SIngle Aspect: all nodes of a type
Independent path : Organization to node
Multiple root nodes