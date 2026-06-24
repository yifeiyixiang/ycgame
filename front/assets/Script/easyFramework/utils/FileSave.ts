import { _decorator, Component, Node } from 'cc';
import {HTML5} from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('FileSave')
export class FileSave extends Component {

    public static saveForBrowser(textToWrite:string, fileNameToSaveAs:string) {
        if (HTML5) {
            console.log("浏览器");

            let textFileAsBlob = new Blob([textToWrite], {type:'application/csv'});
            let downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null)
            {


                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else
            {


                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);

                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();
        }
    }


}

