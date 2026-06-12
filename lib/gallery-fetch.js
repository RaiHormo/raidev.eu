

//import data from '/gallery/art-database.json' with { type: "json" };
let database


let imgs = new Array();
const gallery = document.querySelector('.gallery-container')
const loader = document.querySelector('.gallery-loader')
const folder = "/media/Artwork/";
let tag_template = document.querySelector('.tag-button')
let tag_focus = null
let years = new Array();

fetch('/gallery/art-database.json')
	.then(response => response.json())
	.then(data => {
		database = data
		loadGallery();
});

function loadGallery() {
	for (const picdata of database.artwork) {
		const img = new Image();

		img.classList.add("clickable-image", "gallery-img");
		img.addEventListener('click', () => show_image(img));

		const dateStr = picdata.date; //yyyy/mmm/dd  dd/mm/yyyy
		const date = new Date(dateStr.substring(0,4), toMM(dateStr.substring(6,8)), dateStr.substring(9,11));

		img.setAttribute("date", Date.parse(date));
		img.setAttribute("filename", picdata.filename);
		img.setAttribute("decoding", "async");
		img.setAttribute('alt', picdata.title);
		img.setAttribute("date-text", date.getFullYear() + " " + date.toLocaleString('en-us', { month: 'short' }) + " "+ date.getDate());
		img.setAttribute('tags', picdata.tags);
		img.style.display = 'none';

		imgs.push(img);

		galleryObserver.observe(img);
	}

	tagCheck();
	console.log(imgs);
	
	const fragment = document.createDocumentFragment();
	for (const img of imgs) {
		fragment.appendChild(img);
		
		img.style.display = img.getAttribute("show") || 'block';
		img.style.height = "100%";
		img.style.width = "100%";
	}
	gallery.appendChild(fragment);

	if (!window.location.search.includes("artwork")) {
		waitForImages();
	}
}

function sortGallery() {
	let arr = Array.from(document.getElementsByClassName("gallery-year"));
	arr.forEach(element => {
		if (!years.includes(element.getAttribute("alt"))) {
			element.style.display = "none";
		}
	});
	years.forEach(year => {
		let el = document.createElement('div');
		el.setAttribute('class', "gallery-img gallery-year");
		let date = new Date(year, 11, 30);
		el.setAttribute("date", Date.parse(date));
		el.innerHTML = year;
		el.setAttribute('alt', year);
		imgs.push(el);
	});
	imgs.sort(function(x, y) {
		if (x.getAttribute("date") > y.getAttribute("date")) return -1;
		if (x.getAttribute("date") < y.getAttribute("date")) return 1;
		return 0
	});
	console.log(years);
}

async function waitForImages() {
	for (const img of imgs) {
		img.setAttribute("loading", "lazy");
		if (picdata(img) != null && picdata(img).tags.includes("not-mine")) {
			img.setAttribute("psrc", folder + "NotMine/" + img.getAttribute("filename") + ".avif");
		} else {
			img.setAttribute("psrc", folder + img.getAttribute("filename") + ".avif");
		}
	}
	await new Promise(r => setTimeout(r, 100));
	let i = 0;
	for (const img of imgs) {
		if (img.getAttribute("show") == "block") {
			await loadImage(img);
			i++;
			if (i > 3) {
				loader.style.display = 'none';
			}
		}
	}
	console.log("loaded");
	loader.style.display = 'none';
};

async function loadImage(img) {
	img.setAttribute("loading", "lazy");
	if (!img.hasAttribute("filename")) return;
	if (await (fileExists(img.getAttribute("psrc")))) {
		img.src = img.getAttribute("psrc");
	}
	let wide = img.getAttribute("tags").includes("wide");
	if (wide) {
		img.classList.add("gallery-img-wide");
	}
	if (img.complete) {
		img.style.height = "auto";
		img.style.aspectRatio = img.width+"/"+img.height;
		return;
	}
	return new Promise((resolve, reject) => {
		img.onload = async () => {
			img.style.height = "auto";
			img.style.aspectRatio = img.naturalWidth+"/"+img.naturalHeight;
			console.log(img.getAttribute("filename") + " loaded");
			resolve(true);
		};
	});
};

const galleryObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		const img = entry.target;
		if (img.style.display !== 'none') {
			
			let height = 0;
			if (entry.borderBoxSize && entry.borderBoxSize[0]) {
				height = entry.borderBoxSize[0].blockSize;
			} else {
				height = entry.contentRect.height; // Fallback
			}

			if (height > 0) {
				const rowGap = parseInt(window.getComputedStyle(gallery).getPropertyValue('grid-row-gap')) || 0;
				const rowHeight = parseInt(window.getComputedStyle(gallery).getPropertyValue('grid-auto-rows')) || 1;
				
				const span = Math.ceil((height + rowGap + 1) / (rowHeight + rowGap));
				img.style.gridRowEnd = `span ${span}`;
			}
		}
	}
});

async function fileExists(url) {
   	if (!url) return false;

	try {
		const response = await fetch(url, { method: 'HEAD' });
		return response.ok;
	} catch (error) {
		console.error("Network error checking file:", error);
		return false;
	}
};

function tagCheck() {
	let section = window.location.hash.substring(1);
	drawTagButtons();
	tag_template.style.display = 'none';
	for (const img of imgs) {
		img.setAttribute("show", "block");
		img.style.display = 'block';
	}
	if (section == "") {
		document.querySelector('.gallery-tag-title').innerText = "Finished Work";
		tag_unexpand();
	} else {
		tagPress(section);
		tag_template.style.display = 'unset';
		tag_template.classList.add("tag-button-front")
	}
	
	if (tagdata(section).sketchinclude == "no") {
		for (const img of imgs) {
			let picdat = picdata(img);
			if (picdat != null) {
				picdat.tags.forEach((tag) => {
					if (tagdata(tag) != null && tagdata(tag).exclusive) {
						img.setAttribute("show", "none");
						img.style.display = 'none';
					}
				})
				if (picdat.tags.find((tag) => tag == "sketch")) {
					img.setAttribute("show", "none");
					img.style.display = 'none';
				}
				if (section == "") {
					if (!years.includes(picdat.date.substring(0,4))) {
						years.push(picdat.date.substring(0,4));
					}
				}
			} else {
				img.style.display = 'block';
			}
		}
	}
	sortGallery();
};

function tagPress(section) {
	window.location.href = "#"+section;
	document.querySelector('.gallery-tag-title').innerText = database.tags.find((tag) => tag.name == section).title;

	window.scrollTo(0,-50)
	years = [];


	for (const img of imgs) {
		let data = picdata(img);

		if (data != null) {
			if (data.tags.find((tag) => tag == section) != undefined) {
				img.setAttribute('show', "block");
				img.style.display = 'block';
				if (!years.includes(data.date.substring(0,4))) {
					years.push(data.date.substring(0,4));
				}
			} else {
				img.setAttribute('show', "none");
				img.style.display = 'none';
			}
		}
	};
	console.log("tag check done");
};

function picdata(img) {
	return database.artwork.find( (data) =>
		data.filename == img.getAttribute("filename")
	)
};


function tagdata(wanted) {
	return database.tags.find((tag) => tag.name == wanted);
}

window.addEventListener('hashchange',() => {
	console.log("tag changed");
	tagCheck();
	waitForImages();

	if (window.location.hash == "") {
		if (tag_focus != null) tag_focus.classList.remove("tag-button-selected");
		tag_focus = null;
	}
});

function drawTagButtons() {
	let section = window.location.hash.substring(1);
	if (document.querySelectorAll(".tag-button").length == 1) {
		for (const tag of database.tags) {
			(function() {
				if (tag.name != "") {
					let btn = document.createElement('button');
					btn.classList.add('tag-button');
					btn.innerHTML = `<img class='tag-icon' src='${tag.icon}'>${tag.title}`
					btn.onclick = function() {
						focusBtn(this);
						window.location.hash = tag.name;
					}
					//btn.setAttribute('onclick', 'window.location.href=\'/gallery/#\'+ \''+tag.name+'\';');
					document.querySelector("#tag-container").append(btn);
					if (tag.name == section) {
						focusBtn(btn, 1000);
					}
				}
			})();
		}
	}
};

function toMM(month) {
	return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3;
};

function focusBtn(btn, delay = 0) {
	tag_unexpand();
	setTimeout( function() {
		btn.scrollIntoView({ behavior: "smooth", block: "center", inline: "center"});
		btn.focus();
		btn.classList.add("tag-button-selected");
		if (tag_focus != null) tag_focus.classList.remove("tag-button-selected");
		tag_focus = btn;
	}, delay);
};