'use babel';

import clipboard from 'clipboard'
import fs from 'fs'
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-markdown-image-paste:paste': () => this.paste()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  paste () {
    const editor = atom.workspace.getActiveTextEditor()
    if(!editor){
      return
    }
    const img = clipboard.readImage()
    if(img.isEmpty()){
      return
    }
    const documentTitle = editor.getTitle().split('.').slice(0, -1).join('.')
    const subDirectory = 'images/' + documentTitle.replace(/[^a-zA-Z0-9]/g,'_');
    const uid = getUid()
    const imageFilename = uid + ".png"
    const path = editor.getPath()
    const subDirectoryPath = path.split('/').slice(0, -1).join('/') + "/" + subDirectory
    const imagePath = subDirectoryPath + "/" + imageFilename
    const relativeImagePath = subDirectory + "/" + imageFilename

    if (!fs.existsSync(subDirectoryPath)){
    fs.mkdirSync(subDirectoryPath);
    }
    fs.writeFileSync(imagePath, img.toPNG())
    editor.insertText(`![](${relativeImagePath})`)
  }
};

function getUid(){
  let now = new Date
  return now.toISOString().slice(0, -5).replace(/:/g,"-")
}
