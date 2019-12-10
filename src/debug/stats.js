import Stats from "stats-js";

export function createStats () {
    //fps stats
    let statsFPS = new Stats();
    statsFPS.domElement.style.cssText = "position:absolute;top:3px;left:3px;";
    statsFPS.showPanel(0); // 0: fps,
    document.body.appendChild(statsFPS.dom);
    return statsFPS;
}