function home(){
    window.location.href='/index.html';
}

function w3school(){
    window.location.href='https://www.w3schools.com/css/default.asp';
}

//justify content center
var a = document.getElementById("jc").onclick=function(){
    document.getElementById("flex").style.justifyContent="center";
    }

//justify content space between
var b = document.getElementById("sb").onclick=function(){
    document.getElementById("flex").style.justifyContent="space-between";
    }

    //justify content space around
var c = document.getElementById("sa").onclick=function(){
    document.getElementById("flex").style.justifyContent="space-around";
    }

        //justify content space evenly
var d = document.getElementById("se").onclick=function(){
    document.getElementById("flex").style.justifyContent="space-evenly";
    }

            //justify content flex start
var e = document.getElementById("fs").onclick=function(){
    document.getElementById("flex").style.justifyContent="flex-start";
    }


            //justify content flex end
var f = document.getElementById("fe").onclick=function(){
    document.getElementById("flex").style.justifyContent="flex-end";
    }


                //flex direction row
var g = document.getElementById("row").onclick=function(){
    document.getElementById("flex").style.flexDirection="row";
    }
                    //flex direction row-reverse
var h = document.getElementById("rowreverse").onclick=function(){
    document.getElementById("flex").style.flexDirection="row-reverse";
    }

                    //flex direction column
var i = document.getElementById("column").onclick=function(){
    document.getElementById("flex").style.flexDirection="column";
    }
                    //flex direction column-reverse
var j = document.getElementById("col-rev").onclick=function(){
    document.getElementById("flex").style.flexDirection="column-reverse";
    }

                      //flex wrap
var k = document.getElementById("wrap").onclick=function(){
    document.getElementById("flex").style.flexWrap="wrap";
    }
                    //flex nowrap
var l = document.getElementById("nowrap").onclick=function(){
    document.getElementById("flex").style.flexWrap="nowrap";
    }
                      //flex wrap reverse
var m = document.getElementById("wraprev").onclick=function(){
    document.getElementById("flex").style.flexWrap="wrap-reverse";
    }

                          //aling-content flex-start
var n = document.getElementById("flex-startalign").onclick=function(){
    document.getElementById("flex").style.alignContent="flex-start";
    }
                    //align-content flex-end
var o = document.getElementById("flex-endalign").onclick=function(){
    document.getElementById("flex").style.alignContent="flex-end";
    }
                      //align content center
var p = document.getElementById("centeralign").onclick=function(){
    document.getElementById("flex").style.alignContent="center";
    }
            
                              //alin-content space-between
var q = document.getElementById("space-betweenalign").onclick=function(){
    document.getElementById("flex").style.alignContent="space-between";
    }
                    //align-content space-around
var r = document.getElementById("space-aroundalign").onclick=function(){
    document.getElementById("flex").style.alignContent="space-around";
    }
                      //align-content stretch
var s = document.getElementById("stretchalign").onclick=function(){
    document.getElementById("flex").style.alignContent="stretch";
    }


                                  //alin-items flex-start
var t = document.getElementById("flex-startitems").onclick=function(){
    document.getElementById("flex").style.alignItems="flex-start";
    }
                    //align-items flex-end
var u = document.getElementById("flex-enditems").onclick=function(){
    document.getElementById("flex").style.alignItems="flex-end";
    }
                      //align-items center
var v = document.getElementById("centeritems").onclick=function(){
    document.getElementById("flex").style.alignItems="center";
    }

                          //align-items baseline
var w = document.getElementById("bseline-items").onclick=function(){
    document.getElementById("flex").style.alignItems="baseline";
}

                //align-items stretch
var x = document.getElementById("stretchitems").onclick=function(){
      document.getElementById("flex").style.alignItems="stretch";
}