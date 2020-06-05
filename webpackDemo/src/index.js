import "./index.css";
import pic from "./pic01.jpg";
import _ from 'lodash'
import print from './print'
import more from './more'
print()

more()

function components() {
    var element = document.createElement("div");

    element.innerHTML = _.join(["a", "b"])
    element.classList.add("red");

    // element.onclick = (e) => {
    //     import( /* webpackChunkName: "print" */ './print').then(module => {
    //         console.log(module)
    //         module.default()
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }

    var imgs = new Image();
    imgs.src = pic;

    element.appendChild(imgs);
    return element;
}

document.body.appendChild(components());