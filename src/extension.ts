// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

const root_path = "/Users/liangmx17/Documents/vscode-extension/"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// 校验文件结构，没有的话就创建这些
//	
function check_structure() {
	fs.mkdir(root_path+".a", function (err) {
	 if (err) {
		console.log(err);
		vscode.window.showErrorMessage("Failed!");
		return;
	  }
	  console.log("success...");//success
	}); 
    // 函数定义
    console.log("调用函数");
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
	console.log('Congratulations, your extension "helloworld" is now active!');
	console.log(get_time());

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	
	let disposable = vscode.commands.registerCommand('helloworld.ohmygosh', () => {
		vscode.window.showInformationMessage('Oh my gosh from helloworld!');
	});	

	let currentTime = vscode.commands.registerCommand('helloworld.currentTime', () => {
		vscode.window.showInformationMessage(get_time());
	});
	
	let start_writing = vscode.commands.registerCommand('helloworld.start-writing', () => {
		check_structure();
		vscode.window.showInformationMessage('Check your file');
	});	


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
