import { Modal, App } from "obsidian";


export class PromptModal extends Modal { 
    private message: string;

    constructor(app: App, message: string, private onSubmit: (v: string)=>void) {
        super(app);
        this.message = message
    }

    onOpen() {
        const {contentEl} = this;
        contentEl.createEl("h3",{text:this.message});
        const input = contentEl.createEl("input",{type:"text"});
        const button = contentEl.createEl("button", { text: "Click me" });
		button.addEventListener("click", () => {
			this.onSubmit(input.value);
			this.close();
		});

        input.focus();
    }

    onClose() { this.contentEl.empty(); }
}