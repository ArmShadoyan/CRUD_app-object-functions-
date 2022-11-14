"use strict";

//CRAD = crate (post),read(get),update(put),delete(delete);
const root = document.querySelector("#root");
const url = "http://localhost:8888/todo";

const UI = {
	title: document.createElement("h1"),
	subTitle : document.createElement("p"),
	form : document.createElement("form"),
	screenBlock: document.createElement("div"),
	screenInput: document.createElement("input"),
	screenAddBtn: document.createElement("button"),
	listsBlock: document.createElement("div"),

elementOptions () {
	this.title.textContent = "CRUD";
	this.subTitle.textContent = "Asyn Application"

	this.form.id = "app-form";
	this.screenBlock.id = "screenBlock";
	this.screenInput.type = "text";
	this.screenInput.placeholder = "Type here...";
	this.screenAddBtn.textContent = "ADD";
	this.screenAddBtn.id = "screenAddBtn";
	this.listsBlock.id = "listsBlock";
},

appendElements () {
	root.append(this.title, this.subTitle, this.form, this.listsBlock);
	this.form.append(this.screenBlock);
	this.screenBlock.append(this.screenInput, this.screenAddBtn);
},

toHTML(id,title){
	this.listsBlock.innerHTML += `
	<div class="listsBlockItem">
			<div class="listsBlockItemContent">
				<span>${id}</span>
				<input type="text" value="${title}" readonly>
			</div>

			<div class="buttons">
				<button class="removeBtn">Remove</button>
				<button class="editBtn">Edit</button>
				<button class="saveBtn">Save</button>
				<button class="succeed">Succeed</button>
			</div>
			
	</div>
	`
},
start () {
	this.elementOptions();
	this.appendElements();
}
};
UI.start();

const { form, screenInput} = UI;

function POST() {
	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		if (screenInput.value.trim() !== "") {
			await fetch(url, {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({ title: screenInput.value.trim(), isComplete: false })
			});
		}

		e.target.reset();
	});
}

POST();

async function GET() {
	return await fetch(url)
		.then(data => data.json())
		.then(data => {
			console.log(data);
			data.forEach(obj => {UI.toHTML(obj.id,obj.title);});
			return data
		}).then(data => {
			PUT(
				document.querySelectorAll(".editBtn"),
				document.querySelectorAll(".saveBtn"),
				document.querySelectorAll(".listsBlockItemContent")

			);
			succes(
				document.querySelectorAll(".succeed"),
				document.querySelectorAll(".listsBlockItemContent"),
				data
			);
			DELETE(document.querySelectorAll(".removeBtn"));  
			return data
		}).then(data => console.log(data))
	}

GET();

function PUT(editBtnArray, saveBtnArray, content) {
	editBtnArray.forEach((editBtn, index) => {
		editBtn.addEventListener("click", (e) => {
            e.preventDefault();

			editBtn.style.display = "none";
			saveBtnArray[index].style.display = "inline-block";
			const fakeID = parseInt(content[index].children[0].textContent);
			const input = content[index].children[1];
			input.classList.add("edit");
			input.removeAttribute("readonly");
			console.log(document.querySelectorAll(".saveBtn"));
			saveBtnArray[index].addEventListener("click", async (e) => {
				e.preventDefault();

				await fetch(`${url}/${fakeID}`, {
					method: "PUT",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({ title: input.value.trim(), isComplete: false })
				});
			});
		})
	});
}

function DELETE(removeBtn) {
	removeBtn.forEach(btn => {
		btn.addEventListener("click", async (e) => {
			e.preventDefault();

			const fakeID = parseInt(btn.parentElement.previousElementSibling.firstElementChild.textContent);
			btn.parentElement.parentElement.remove();

			await fetch(`${url}/${fakeID}`, {
				method: "DELETE"
			})
		});
	});
}

function succes (succeedBtn,content,data) {
	succeedBtn.forEach((btn,index) => {
		btn.addEventListener("click",async (e) => {
			e.preventDefault();
			console.log(data);
			const input = content[index].children[1];
			const fakeID = parseInt(content[index].children[0].textContent);

				await fetch(`${url}/${fakeID}`, {
				method: "PUT",
				headers: {
					"content-type": "application/json"
				},
				body:data[index].isComplete === false?
				 JSON.stringify({title: input.value.trim(),isComplete:true}) 
				:JSON.stringify({title: input.value.trim(),isComplete:false})
			});
		});
	});
}