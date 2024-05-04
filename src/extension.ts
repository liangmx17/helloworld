// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

const root_path = "/Users/liangmx17/Documents/vscode-extension/helloworld/";

function check_path(path:string):boolean{
	if (fs.existsSync(path)) {
		console.log(`${path}已存在`);
		return true;
	} else {
		console.log(`${path}不存在，开始创建`);
		//	这里的function（err）是一个call back，居然可以这么写，神奇
		fs.mkdir(root_path+".a", function (err) {
			if (err) {
		   		console.log(err);
		   		vscode.window.showErrorMessage(`${path}创建失败!`);
		   		return false;
		 	}
	   		}); 
		console.log(`${path}创建成功!`);
		//	创建文件，失败则返回false
		return true;
	}
}

function check_file(path:string, filename:string):boolean{
	let fd=0;
	if(fs.existsSync(path+filename)){
		console.log(`${filename}已存在于${path+filename}`);
		
		// #TODO 接下来负责写文件解码的部分，并且传输到对应的部分
		return true;
	} else {
		console.log(`${filename}不存在，开始创建于${path+filename}`);
		fs.open(path+filename,'w',function(err,fd) {
			if (err) {
				console.error(err);
				return false;
			}
		});
		console.log("文件创建成功！"); 

		fs.close(fd,function(err){
			if (err){
			   console.log(err);
			} 
		 });
		 console.log("文件关闭成功");
		 return true;
	}
}
function check_structure() {
	const	info_path = '.a/';
	const character = 'character.md';
	const plot = 'plot.md';
	const other = 'other.md';
	const scene = 'scene.md';

	check_path(root_path+info_path);
	check_file(root_path+info_path,"asf");
	check_file(root_path+info_path,plot);
	check_file(root_path+info_path,other);
	check_file(root_path+info_path,scene);
};

function get_time(){
	let currentDate = new Date();
	let year = currentDate.getFullYear();
	let month = currentDate.getMonth() + 1;
	let date = currentDate.getDate();
	let hours = currentDate.getHours();
	let minutes = currentDate.getMinutes();
	let seconds = currentDate.getSeconds();
	let message = `当前时间：${year}-${month}-${date}  ${hours}:${minutes}:${seconds}`;
	// console.log(message);
	return message;
};

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "novel" is now active!');
	console.log(get_time());

	const wordCounter = new WordCounter();

    let disposable2 = vscode.commands.registerCommand('novel.wordCount', () => {
        const count = wordCounter.updateWordCount();
        if (count && count >= 0) {
            vscode.window.showInformationMessage(`字数：${count}`);
        }
    });

    context.subscriptions.push(wordCounter);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	
	let disposable = vscode.commands.registerCommand('novel.ohmygosh', () => {
		vscode.window.showInformationMessage('Oh my gosh from novel!');
	});	

	let currentTime = vscode.commands.registerCommand('novel.currentTime', () => {
		vscode.window.showInformationMessage(get_time());
	});
	
	let start_writing = vscode.commands.registerCommand('novel.start-writing', () => {
		check_structure();
		vscode.window.showInformationMessage('Check your file');
	});	


	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}


class WordCounter {
    // VSCode 底部状态栏
    private _statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    private _progressBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    // 释放队列
    private _disposable: vscode.Disposable;
    // subscribe event
    constructor() {
        // 注册事件
        const subscriptions: vscode.Disposable[] = [];
        // 注册光标改变事件
        vscode.window.onDidChangeTextEditorSelection(this.updateWordCount, this, subscriptions);
        // 注册切换文件事件
        vscode.window.onDidChangeActiveTextEditor(this.updateWordCount, this, subscriptions);
        // 更新状态栏
        this.updateWordCount();
        // 需要释放的事件队列
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    // 获取编辑器及编辑内容的上下文
    public updateWordCount() {
        // 获取当前编辑器对象
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return false;
        }
        // 当前编辑对象
        const doc = editor.document;
        const wordCount = this._getWordCount(doc);
        this._statusBarItem.text = `${wordCount} 字`;
        this._statusBarItem.show();

		//	进度判断
		if (doc.languageId === 'markdown') {
            const progress = wordCount/40;
            this._progressBarItem.text = `${progress}%`;
            this._progressBarItem.show();
            return wordCount;
        } else {
            this._progressBarItem.hide();
        }
        return wordCount;
    }
    // 统计函数
    public _getWordCount(doc: vscode.TextDocument): number {
        // 当前编辑内容
        const docContent: string = doc.getText();
        const filterStr: string = docContent.replace(/\r\n/g, "\n");
        // 中文字数
        const chineseTotal: Array<string> = filterStr.match(/[\u4e00-\u9fa5]/g) || [];
        // 匹配单字字符
        const englishTotal: Array<string> = filterStr.match(/\b\w+\b/g) || [];
        // 匹配数字
        const letterTotal: Array<string> = filterStr.match(/\b\d+\b/g) || [];

        return (chineseTotal.length + (englishTotal.length - letterTotal.length)) || 0;	//怎么统计英文单词的没看懂，但不影响
    }
    // 当插件禁用时
    dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }

}


// This method is called when your extension is deactivated
export function deactivate() {}
