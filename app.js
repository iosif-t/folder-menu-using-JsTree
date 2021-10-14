var treeSelector;
var offset;

function init_tree(data) {
    $("#new_tree").jstree({
        core: {
            data: data,
        },
        plugins: ["search"],
        search: {
            case_sensitive: false,
            show_only_matches: true,
            search_callback: function (searchstr, node) {
                let regex = new RegExp(searchstr);
                let str=node.original.path.toUpperCase()
                str=remove_primes(str)
                return regex.test(str);
            },
        },
    })
}


function remove_primes(string){
    let new_str="";
    for(let i=0;i<string.length;i++){
        if(string.charAt(i)=="Ά")
            new_str+="Α"
        else if(string.charAt(i)=="Έ")
            new_str+="Ε"
        else if(string.charAt(i)=="Ή")
            new_str+="Η"
        else if(string.charAt(i)=="Ό")
            new_str+="Ο"
        else if(string.charAt(i)=="Ί")
            new_str+="Ι"
        else if(string.charAt(i)=="Ύ")
            new_str+="Υ"
        else if(string.charAt(i)=="Ώ")
            new_str+="Ω"
        else
            new_str+=`${string[i]}`
    }

   return new_str;
}
async function getFile(dataPath) {
    return $.getJSON(dataPath, async function (data) {
        return data;
    })
}
async function main(selector,Offset,dataPath) {
    treeSelector = selector;
    offset=Offset; 
 
    let search_field="<form><input id='searchI' class='search-input' value='Search'  style='width:60%;' />"
    let search_button="<input type='submit' id='submit'  value='S' style='border-color: black;margin-left:10%;'>"
    let clear_button="<input type='submit' id='clear'  value='X' style='border-color: black; margin-left:10%;'></form>"
    let first_div=`<div  style="width:25%;position:fixed;background-color:black" id ='first_row'>${search_field+search_button+clear_button}</div>`;
    let second_div="<div  style='padding-top:10%' id ='new_tree'></div>";
    let third_div="<div  id='show_res' style='margin-left:10%'></div>";
    document.getElementById(treeSelector).innerHTML+=first_div+second_div+third_div;
    var jsons = await getFile(`${dataPath}`);
    rename_json_ids(jsons)
    init_tree(jsons, 'new_tree');
    $("#new_tree").jstree(true).hide_dots()
}

function rename_json_ids(file){
   for(let i=0;i<file.length;i++){
       file[i].id="j1_"+file[i].id;
       rename_json_ids(file[i].children)
   }
}

$(document).ready(()=>{
    $("#searchI").on("focus",()=>{
        $("#searchI").val("");
    })
})

$(document).ready(()=>{
    $("#searchI").on("blur",()=>{
        let val=$("#searchI").val();
        if(!val)
            $("#searchI").val("Search")
    })
})


$(document).ready(function () {
    $("#new_tree").bind("select_node.jstree", function (e, data) {
        var scroll_position = data.node.original.id;
        scroll_position=scroll_position.split("_")[1];
        var el = document.getElementById(`${scroll_position}`);
        if (el){
            el.scrollIntoView();
            window.scrollBy(0,2);
        }
    });
})
var searchButtonClicked = false;
$(document).ready(function () {
    $("#new_tree").bind("before_open.jstree", function (e, data) {

        if (!searchButtonClicked)
            if (data && data.node.parent == '#' && !searchButtonClicked)
                $("#new_tree").jstree(true).close_all();

    });
})

const addInfo = (ev) => {
    searchButtonClicked = false;
    document.getElementById("show_res").innerText=''
    $("#new_tree").jstree(true).clear_search();
    $("#new_tree").jstree(true).show_all();
    ev.preventDefault();
    let str = document.getElementById("searchI").value;
    if (str) {
        str=str.toUpperCase();
        str=remove_primes(str);
        searchButtonClicked = true;
        let string = str.split(" ");
        for (let i = 0; i < string.length; i++)
            string[i] = `(?=.*${string[i]})`;
        let regex = string.join('');


        $("#new_tree").jstree(true).close_all();
        $("#new_tree").jstree("search", `${regex}`);
    }

};

$(document).ready(function () {
    $("#new_tree").on("search.jstree", (node, str) => {
       
        let tmp = $("#new_tree").jstree(true).get_node(str.res[0]);
        document.getElementById("show_res").innerText=`found ${str.res.length}`
        if(str.res.length==0)
        $("#new_tree").jstree(true).hide_all();
        let docEl = document.getElementById(str.res[0]);
        if (docEl)
            docEl.scrollIntoView()
    });
})

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit").addEventListener("click", addInfo);
});
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("clear").addEventListener("click", (ev)=>{
        $("#new_tree").jstree(true).clear_search();
        $("#new_tree").jstree(true).show_all();
        searchButtonClicked = false;
        document.getElementById("show_res").innerText=''
        $("#searchI").val("Search");
    });
});



var prev = null;

$(document).ready(function () {
    $(window).scroll(function () {
        var Wscroll = $(this).scrollTop();

        $("div").each(function () {
            var ThisOffset = $(this).closest("div").offset();
            if (
                Wscroll > ThisOffset.top &&
                Wscroll < ThisOffset.top + $(this).closest("div").outerHeight(true)
            ) {
                var name = $(this).attr("id");
             
                    var node = $("#new_tree").jstree(true).get_node("j1_"+name);
                    
                    if (node) {
                        $("#new_tree").jstree(true)._open_to(node);
                        if (document.getElementById($(this).attr("id"))) {
                            let tmp = document.getElementById($(this).attr("id"));
                              
                            let temp = document.getElementById("j1_"+tmp.id);
                          
                            if (temp) {
                                if (prev) prev.style.color = prev.color;

                                prev = temp.childNodes[1];
                                prev.color=prev.style.color
                                
                                temp.scrollIntoView();
                                let first_child=temp.childNodes[1];
                                if(first_child)
                                    first_child.style.color = "white";
                                
                              
                            }
                        }
                    }
            
            }
        });
    });
});


