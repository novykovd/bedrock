import {Plugin, TAbstractFile, TFile} from 'obsidian';
import { encryptFile, decryptFile } from './encrypt';
import { PromptModal } from './modal';
import { resolve } from 'path';

export default class MyPlugin extends Plugin{

    ext = "enc"

    forceAsyncModal():Promise<string>{
        return new Promise((resolve) => {
            new PromptModal(this.app, "passphrase", txt => resolve(txt)).open()
        })
    }

    async onload(){
        this.registerExtensions([this.ext], "markdown")

        //decrypt
        this.app.workspace.on("file-open", async (file) => {
            if(file?.extension === this.ext){
                var passphrase: string = await this.forceAsyncModal()
                const raw = await this.app.vault.readBinary(file)
                    .then(text => Buffer.from(text))
                    .then(buffer => decryptFile(buffer, passphrase))
                
                const filename = file.path.slice(0, -(this.ext.length + 1)) 
                this.app.vault.createBinary(filename, raw)
                this.app.vault.delete(file)
                

                var newfile = this.app.vault.getAbstractFileByPath(filename)
                if(newfile instanceof TFile){
                    await this.app.workspace.getLeaf(true).openFile(newfile)
                }else{
                    console.log("unexpected behaviour")
                }
                    
            }
        })

        //encrypt
        this.registerEvent(
            this.app.workspace.on("file-menu", (menu, file) => {
                menu.addItem((item) => item
                    .setTitle("encrypt")
                    .onClick(async () => {
                        if(!(file instanceof TFile)){
                            console.log("folder selected?")
                            return
                        }
                        try{
                        var passphrase = await this.forceAsyncModal()
                        const raw = await this.app.vault.readBinary(file)
                            .then(text => Buffer.from(text))
                            .then(buffer => encryptFile(buffer, passphrase))
                        const filename = file.path + "." + this.ext
                        this.app.vault.delete(file)
                        this.app.vault.createBinary(filename, raw)   
                        }catch(e){
                            console.log(e)
                        }
                    }))
            })
        )
    }
    
    async onunload(){

    }

} 


