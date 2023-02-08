
let mx = 0, my = 0;
function arrString(arr) {
    let text = "";
    // if(!(arr.length > 0)) return text;
    arr.forEach((element, index, thisArg) => {
        text+= `<i class="num">${element}</i>${index == thisArg.length - 1? "" : ", "}`;
    });
    return text;
}

function coordinate(ev) {
    const $x = document.querySelector("#coordinate i.x"),
    $y = document.querySelector("#coordinate i.y"),
    {x, y} = ev.target.getBoundingClientRect();
    
    let dx = Math.ceil(ev.clientX - x), dy = Math.ceil(ev.clientY - y);
    $x.textContent = dx;
    $y.textContent = dy;
}

function restore ($code, codes, forward) {
    const $oldChild = document.getElementById("graphy");
    const $newChild = document.createElement("canvas");
    $newChild.id = "graphy";
    $newChild.className = $oldChild.className;
    $newChild.width = $oldChild.width;
    $newChild.height = $oldChild.height;
    
    $oldChild.parentElement
    .replaceChild($newChild, $oldChild);
    $code.innerHTML = "code...";
    codes; // restore code...
    let $count = document.querySelector("p#count i.count");
    $count.textContent = codes.length;

    if(codes.length > 0) document.querySelector("#back").disabled = false;
    else document.querySelector("#back").disabled = true;
    
    if(forward.length > 0) document.querySelector("#forward").disabled = false;
    else document.querySelector("#forward").disabled = true;

    if(forward.length > 0) document.querySelector("#forward").disabled = false;
    else document.querySelector("#forward").disabled = true;
}

function copy(target, content) {
    navigator.clipboard.writeText(content.textContent)
    .then(()=> {
        let textOriginal = target.textContent;
        target.textContent = "copied!";
        target.classList.add("copied");
        setTimeout(()=> {
            target.textContent = textOriginal;
            target.classList.remove("copied");
        }, 2400);
    })
    .catch(err=> {
        
        let textOriginal = target.textContent;
        target.textContent = "falied!";
        target.classList.add("falied");
        setTimeout(()=> {
            target.textContent = textOriginal;
            target.classList.remove("falied");
        }, 2400);
    });
}

let codes = [];

let forward = [];


const $code = document.getElementById("code-grapy");

function viewInterface () {
    const $arcCollect = document.getElementById("@arc"),
    $node = document.importNode($arcCollect.content, true);
    document.body
        .appendChild($node);
        return document.body.querySelector("form#arcValues");
    }
    function viewInterface2 (qx, qy) {
        const $arcCollect = document.getElementById("@quadraticCurveTo");
        
        let $formulary = $arcCollect.content.querySelector("form");
        $formulary.x.value = qx;
        $formulary.y.value = qy;
        
        const $node = document.importNode($arcCollect.content, true);
        document.body
        .appendChild($node);
        return document.body.querySelector("form#execQuadratic");
    }
    function viewInterface3 (bx1, by1, bx2, by2) {
        const $arcCollect = document.getElementById("@bezierCurveTo");
        
        let $formulary = $arcCollect.content.querySelector("form");
        $formulary.x1.value = bx1;
        $formulary.y1.value =  by1;

        $formulary.x2.value = bx2;
        $formulary.y2.value =  by2;
        
        const $node = document.importNode($arcCollect.content, true);
        document.body
        .appendChild($node);
        return document.body.querySelector("form#bezierCurveTo");
    }
    

document.addEventListener("click", ev=> {
    if(ev.target.matches("#graphy")) {
        if(ev.altKey);
        else {
            mx = ev.clientX;
            my = ev.clientY;
            Draw(ev.target, ev, document.functs.Funct.value);
        }
        
        if(codes.length > 0) document.querySelector("#back").disabled = false;
        else document.querySelector("#back").disabled = true;
        
    }
    else if (ev.target.matches("#exit-quadratic")) Draw(document.getElementById("graphy"), ev, "quadraticCurveTo-exit");

    else if (ev.target.matches("#exit-bezier")) Draw(document.getElementById("graphy"), ev, "bezierCurveTo-exit");

    else if (ev.target.matches("#yes-bezier")) Draw(document.getElementById("graphy"), {clientX: mx, clientY: my}, "bezierCurveTo-saved");

    else if (ev.target.matches("#yes-quadratic")) Draw(document.getElementById("graphy"),  {clientX: mx, clientY: my}, "quadraticCurveTo-saved");
    
    else if(ev.target.matches("button.copy")) copy(ev.target, $code);

    else if(ev.target.matches("#exit-arc")) Draw(document.getElementById("graphy"), ev, "@arc-exit");

    else if(ev.target.matches("#yes-arc"))
        Draw(document.getElementById("graphy"), {clientX: mx, clientY: my}, "@arc-saved");

    
    else if(ev.target.matches("button#restore")) {
        Draw(document.getElementById("graphy"), ev, "quadraticCurveTo-exit");
        Draw(document.getElementById("graphy"), ev, "@arc-exit");
        Draw(document.getElementById("graphy"), ev, "bezierCurveTo-exit");

        restore($code, codes = [], forward = []);
    }
    
    else if(ev.target.matches("#back")) {
        let lastIndex = codes.length -1;
        
        let newArr = codes.filter((el, index)=> index !== lastIndex);
        forward.unshift(codes[lastIndex]);
        
        codes = newArr;
        Draw(document.getElementById("graphy"), ev, null);
        
        if(codes.length > 0) document.querySelector("#back").disabled = false;
        else document.querySelector("#back").disabled = true;
        
        if(forward.length > 0) document.querySelector("#forward").disabled = false;
        else document.querySelector("#forward").disabled = true;

        Draw(document.getElementById("graphy"), ev, "@arc-exit");
    }
    else if(ev.target.matches("#forward")) {
        let first = 0;
        let newArr = forward.filter((el, index)=> index !== first);

        codes.push(forward[first]);

        forward = newArr;

        Draw(document.getElementById("graphy"), ev, null);

        if(forward.length > 0) document.querySelector("#forward").disabled = false;
        else document.querySelector("#forward").disabled = true;

        if(codes.length > 0) document.querySelector("#back").disabled = false;
        else document.querySelector("#back").disabled = true;

        Draw(document.getElementById("graphy"), ev, "@arc-exit");
    }
});
let $formArc = null;
document.addEventListener("mousemove", ev=> {
    if(ev.target.matches("#graphy")) coordinate(ev);
    else null;
});




function Draw (canvas, ev, method) {
    const {width, height, x, y} = canvas.getBoundingClientRect();

    let dx = Math.ceil(ev.clientX - x), dy = Math.ceil(ev.clientY - y);
    
    let context = canvas.getContext('2d');
    
    context.clearRect(0, 0, width, height);

    context.fillStyle = "white";
    context.strokeStyle = "yellow";

    context.beginPath();
    context.arc(dx, dy, 2, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    
    context.beginPath();
    context.strokeStyle = "yellow";
    context.strokeLineJoin = "miter";
    context.strokeLineCap = "butt";
    context.lineWidth = 2;
    let textCode = "";
    if(method == "moveTo" || method == "lineTo") codes.push({
        clave: method, values: [dx,dy]
    });
    
    else if(method == "Comment") codes.push(prompt("Escribir comentario: ", ""));

    else if (method == "arc" || method == "@arc-saved") {

        if($formArc === null) $formArc = viewInterface();
        else 0;
        let {radius, startAng, endAng, clockWise} = $formArc;

        if(method === "@arc-saved") {
            let arc6V = [dx, dy, 1* radius.value, Math.PI / 180 * startAng.value, Math.PI / 180 * endAng.value, eval(clockWise.value)];
            codes.push({
                clave: "arc", values: arc6V
            });
            $formArc.parentElement.removeChild($formArc);
            $formArc = null;
        }
        else{
            context.moveTo(dx, dy);
            context.arc(dx, dy, 1* radius.value, Math.PI / 180 * startAng.value, Math.PI / 180 * endAng.value, eval(clockWise.value));
        }

        document
        .addEventListener("input", (ev)=> {
            ev.clientX = mx; ev.clientY = my;
            let isForm = (ev.target.parentElement).parentElement.parentElement;
            
            if(isForm === $formArc) Draw(document.getElementById("graphy"), ev, "arc");
            else Draw(document.getElementById("graphy"), ev, "@arc-exit");

        }, {once: true, capture: false});
    }
    
    else if (method == "@arc-exit") {
        if(document.body.querySelector("form#arcValues"))
        document.body.querySelector("form#arcValues")
        .parentElement.removeChild(document.body.querySelector("form#arcValues"));
        else ;
        $formArc = null;
    }
    else if (method == "quadraticCurveTo" || method == "quadraticCurveTo-saved") {
        try {
            let two = (codes[codes.length-1].values).filter((el, index)=> index <= 1);
            
            if($formArc == null) $formArc = viewInterface2(...two);
            else 0;
            
            let {x, y} = $formArc; x= eval(x.value); y = eval(y.value);
            if(method == "quadraticCurveTo-saved") {
                $formArc.parentElement.removeChild($formArc);
                $formArc = null;
                codes.push({
                    clave: "quadraticCurveTo",
                    values: [x, y, dx, dy]
                });
            } else {
                context.moveTo(...two);
                context.quadraticCurveTo(x, y, dx, dy);
            }

            document
            .addEventListener("input", (ev)=> {
                ev.clientX = mx; ev.clientY = my;
                let isForm = (ev.target.parentElement);

                if(isForm === $formArc) Draw(document.getElementById("graphy"), ev, method);
                else Draw(document.getElementById("graphy"), ev, "quadraticCurveTo-exit");
        
            }, {once: true, capture: false});
        }
        catch (err) {
        alert(`Usa la funcion moveTo() para ulilizar ${method}(), sino genera el error: ${err.message}`);
    }
}

else if (method == "quadraticCurveTo-exit") {
        if($formArc !== null){
            $formArc.parentElement.removeChild($formArc);
            $formArc = null;
        }
    }
    else if (method == "bezierCurveTo" || method == "bezierCurveTo-saved") {
        try {
            
            let three = (codes[codes.length-1].values).filter((el, index)=> index <= 1);
            
            if($formArc == null) $formArc = viewInterface3(...three, dx, dy);
            else 0;
            let {x1, y1, x2, y2} = $formArc;
            x1 = eval(x1.value);
            x2 = eval(x2.value);
            y1 = eval(y1.value);
            y2 = eval(y2.value);
            
            if(method == "bezierCurveTo-saved") {
                codes.push({
                    clave: "bezierCurveTo",
                    values: [x1, y1, x2, y2, dx, dy]
                });
                $formArc.parentElement.removeChild($formArc);
                $formArc = null;

            }
            else {
                
                context.moveTo(...three);
                
                context.bezierCurveTo(x1, y1, x2, y2, dx, dy);
                
            }
            
            document
            .addEventListener("input", (ev)=> {
                ev.clientX = mx; ev.clientY = my;
                let isForm = (ev.target.parentElement);
        
                if(isForm === $formArc) Draw(document.getElementById("graphy"), ev, method);
                else Draw(document.getElementById("graphy"), ev, "bezierCurveTo-exit");
        
            }, {once: true, capture: false});
        } catch (err) {
            alert(`Usa la funcion moveTo() para ulilizar ${method}(), sino genera el error: ${err.message}`);
        }
        
    } 
    else if (method == "bezierCurveTo-exit") {
        if($formArc !== null){
            $formArc.parentElement.removeChild($formArc);
            $formArc = null;
        }
    }
     else 0;
    let $count = document.querySelector("p#count i.count");
    $count.textContent = codes.length;
    
    for(const code of codes) {

        if(typeof(code) === "object"){
            textCode+= `<i class="obj">context</i>.<i class="mth">${code.clave}</i>(${arrString(code.values)});<br>\n`;
            context[code.clave](...code.values);
        }

        else if(typeof(code) === "string")
        textCode+= `<i class="comment"> ${code} </i> <br>\n`;
        else 0;

    }

    /* allCode... */


        

    $code.innerHTML = textCode;
    context.stroke();

    context.closePath();

}