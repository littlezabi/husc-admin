<script lang="ts">
	import { getRandomChar } from '$lib/globals';
	import { updateMessages } from '$lib/store';
	import { onMount } from 'svelte';
	import {
		ChevronUp,
		Clipboard,
		ClipboardDocumentList,
		CodeBracketSquare,
		Icon,
		Scissors
	} from 'svelte-hero-icons';
	import { slide } from 'svelte/transition';
	import FontsComponent from './fonts-component.svelte';
	export let title: string = '';
	let cssStyleObject: any = {};
	export let editorContent = ``;
	export let callback: (content:string) => void;
	const updateText = () => {
		let ssheet = document.getElementById('blw-style-content')?.innerHTML ?? '';
		let content = document.getElementById('blw-text-content')?.innerHTML ?? '';
		callback(ssheet + content);
	}
	let contextMenuToggler = false;
	let showCssSelectorText: { key: string | boolean; value: string | boolean } = {
		key: false,
		value: false
	};
	let stylePropertiesInClass: any = {};
	let timeTimout__: any = null;
	const getParentStyle = (selection?: any) => {
		stylePropertiesInClass = {};
		let r = { parentClass: '', currentClass: '' };
		try {
			if (!selection) selection = window.getSelection();
			const range = selection.getRangeAt(0);
			let parentNode = range.startContainer.parentNode;
			let pClass = parentNode.getAttribute('class');
			if (pClass && !pClass.includes('content-editor')) {
				renderStyleScriptForTextarea(pClass);
				r.parentClass = pClass;
			}
			if (parentNode.innerText === selection.toString() && pClass.includes('___'))
				r.currentClass = pClass;
		} catch (e) {
			console.warn(e);
		}
		return r;
	};
	let currentSelectionClass = '';
	const applyStyle = (cssProperty: { key: string; value: string }) => {
		try {
			let new_class = currentSelectionClass;
			let { currentClass } = getParentStyle();
			if (currentClass.length) {
				new_class = currentClass;
			} else {
				if (!currentSelectionClass) {
					let x = addCssStyle();
					if (x) new_class = x;
				}
			}
			if (new_class) {
				let old_style = cssStyleObject[new_class].split('}');
				let last_style = old_style.length > 1 ? old_style[1] : '';
				old_style = old_style[0];
				const createRegex = (value?: string) => `${cssProperty.key}:\s*(.*?)${value ? value : ''};`;
				if (old_style.match(createRegex(cssProperty.value))) {
					old_style = old_style.replace(new RegExp(createRegex(cssProperty.value)), '');
				} else if (old_style.match(createRegex())) {
					old_style = old_style.replace(
						new RegExp(createRegex()),
						`${cssProperty.key}:${cssProperty.value};`
					);
				} else {
					old_style = old_style + cssProperty.key + ':' + cssProperty.value + ';';
				}
				cssStyleObject[new_class] = old_style + '}' + last_style;
				renderStyleScriptForTextarea(new_class);
				setupEditorContentAndCss(cssStyleObject);
			} else {
				updateMessages({ message: 'Please try again! failed to set style', variant: 'alert' });
			}
			updateText()
		} catch (e) {
			console.warn(e);
		}
	};
	const handleCustomeStyle = (cssSelector: any) => {
		cssStyleObject[cssSelector] = `{}`;
	};
	function getSelectors(element: any) {
		const selectors = [];
		let currentElement = element;
		while (currentElement !== document.documentElement) {
			if (currentElement.id) {
				selectors.unshift(`#${currentElement.id}`);
				break;
			} else {
				let tagName = currentElement.tagName.toLowerCase();
				let index = Array.from(currentElement.parentNode.children).indexOf(currentElement) + 1;
				let selector = tagName;
				if (index >= 1) selector + ':nth-child(' + index + ')';
				console.log(selector);
				selectors.unshift(selector);
				currentElement = currentElement.parentNode;
			}
		}

		return selectors.join(' > ');
	}

	const addCssStyle = () => {
		try {
			const selection: any = window.getSelection();
			if (!(selection.toString() !== '')) {
				updateMessages({ message: 'Text is not selected!', variant: 'alert' });
				return false;
			}
			const range = selection.getRangeAt(0);
			const span: any = document.createElement('span');
			const cssClass = '___' + getRandomChar(6, { numbers: false, symbols: false });
			span.setAttribute('class', cssClass);
			range.surroundContents(span);
			handleCustomeStyle(cssClass);
			currentSelectionClass = cssClass;
			return cssClass;
		} catch (e) {
			console.warn('addCssStyle: ', e);
			return false;
		}
	};
	const setupEditorContentAndCss = (cssStyleObject: any) => {
		let cssStyle: string[] | string = Object.keys(cssStyleObject).map((e) => {
			return `.${e}${cssStyleObject[e].replaceAll(/\s{2,4}|\n/gi, '')} `;
		});
		cssStyle = cssStyle.join('');
		let c: any = document.getElementById('blw-style-content');
		c.innerHTML = '<style>' + cssStyle + '</style>';
	};
	const closingModal = (e: any) => {
		contextMenuToggler = false;
	};
	onMount(() => {
		setupEditorContentAndCss(cssStyleObject);
		const contextMenu: any = document.getElementById('context-menu');
		const content: any = document.getElementById('blw-text-content');
		const contextMenuOpen = (e: any) => {
			e.preventDefault();
			contextMenuToggler = true;
			const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const x = e.clientX + scrollLeft - 18;
			const y = e.clientY + scrollTop + 11;
			contextMenu.style.left = `${x}px`;
			contextMenu.style.top = `${y}px`;
		};
		content.addEventListener('contextmenu', contextMenuOpen);
		const openEditContextModel = (e: any) => {
			contextMenuToggler = false;
			const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const x = e.clientX + scrollLeft - 18;
			const y = e.clientY + scrollTop + 11;
		};
		const handleSelection = (e: any) => {
			// fontSizeInput = 14
			currentSelectionClass = '';
			const selection: any = window.getSelection();
			if (e.button === 0) {
				if (selection.toString().length > 0) {
					let { parentClass } = getParentStyle(selection);
					setTimeout(() => openEditContextModel(e), parentClass.length ? 400 : 0);
				}
			}
		};
		content.addEventListener('mouseup', handleSelection);
		document.addEventListener('mousedown', closingModal);
		return () => {
			document.removeEventListener('mousedown', closingModal);
			content.removeEventListener('contextmenu', contextMenuOpen);
			content.removeEventListener('mouseup', handleSelection);
		};
	});
	const handleNewStyle = (e: any, selector: string | boolean) => {
		if (typeof selector === 'string') {
			if (timeTimout__) {
				clearTimeout(timeTimout__);
			}
			timeTimout__ = setTimeout(() => {
				console.log(cssStyleObject[selector]);
				cssStyleObject[selector] = e.target.value;
				setupEditorContentAndCss(cssStyleObject);
			}, 600);
		}
	};
	const dispatchButton = (combination: string) => {
		let message: boolean | string = false;
		let variant: string = 'alert';
		if (combination === 'paste')
			message =
				"Your browser doesn't support to paste text from clipboard. You can use (CTRL + V/C/X) shortcuts from keyboard.";
		else if (combination === 'copy' || combination === 'cut') {
			const selection: any = window.getSelection();
			navigator.clipboard.writeText(selection.toString());
			if (combination === 'cut')
				message =
					"Your browser doesn't support to cut text from clipboard. You can use (CTRL + V/C/X) shortcuts from keyboard.";
		}
		if (message)
			updateMessages({
				message,
				variant,
				closing_time: 8000
			});
	};
	const handleStyleKeyDown = (e: any) => {
		if (e.key === 'Tab') {
			e.preventDefault();
			const textarea = e.target;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = textarea.value;
			const newText = text.substring(0, start) + '    ' + text.substring(end);
			textarea.value = newText;
			textarea.setSelectionRange(start + 4, start + 4);
		}
	};
	const renderStyleScriptForTextarea = (selector: string) => {
		if (!selector) showCssSelectorText = { key: selector, value: false };
		else {
			let _object_ = cssStyleObject[selector];
			if (!_object_) return 0;
			let values = cssStyleObject[selector]
				.replaceAll('{', '{\n    ')
				.replaceAll('}', '\n}')
				.replaceAll(';', ';\n    ')
				.replaceAll(':', ': ');
			showCssSelectorText = { key: selector, value: values };
			let _ux_ = _object_.replaceAll(/\{|}/gi, '').split(';');
			for (let a of _ux_) {
				let v = a.split(':');
				if (v[0] !== '' && v[1]) stylePropertiesInClass[v[0]] = v[1];
			}
		}
	};
	// handle fonts
	let holdFZInput = false;
	let fontSizeInput: number = 14;
	let appliedFZ = false;
	const handleFKey = (buttonEvent: any) => {
		let key = buttonEvent.key;
		let fz: string = String(fontSizeInput);
		if (key === 'Enter') {
			appliedFZ = true;
			applyStyle({ key: 'font-size', value: `${fontSizeInput}px` });
		} else {
			if (key === 'Backspace') {
				if (fz.length > 0) {
					let t = fz.substring(0, fz.length - 1);
					fz = t ? t : '0';
				}
			} else {
				if (key.match(/\d|[px]/)) {
					if (!holdFZInput || fz === '0') fz = buttonEvent.key;
					else {
						if (parseInt(fz + buttonEvent.key) <= 1000) {
							fz += buttonEvent.key;
						}
					}
					holdFZInput = true;
				}
			}
			fontSizeInput = parseInt(fz);
			if (fontSizeInput >= 1000) fontSizeInput = 1000;
		}
	};
	const handleFontSize = (e: any) => {
		appliedFZ = false;
		e.target.classList.add('active');
		window.addEventListener('keyup', handleFKey);
	};
	const RemHandleFontSize = (e: any) => {
		e.target.classList.remove('active');
		window.removeEventListener('keyup', handleFKey);
		if (!fontSizeInput) fontSizeInput = 14;
		holdFZInput = false;
		if (!appliedFZ) applyStyle({ key: 'font-size', value: `${fontSizeInput}px` });
	};
	let openStyleSheet = false;
</script>

<div class="blw-wrap">
	<h2>{title}</h2>
	<div class="editing-section">
		<div class="flex" style="margin-bottom: 10px;">
			<label for="open-style" style="font-size: 12px;">Open Style Sheet</label>
			<input
				style="margin-left: 18px;"
				on:change={() => (openStyleSheet = !openStyleSheet)}
				type="checkbox"
				name="open-style"
				id="open-style"
			/>
		</div>

		{#if openStyleSheet}
			<div>
				<div class="selector-list">
					{#each Object.keys(cssStyleObject) as selectors}
						<button
							class="sel392c"
							type="button"
							on:click={() => renderStyleScriptForTextarea(selectors)}>.{selectors}</button
						>
					{/each}
					<div>
						{#if showCssSelectorText.key}
							<div transition:slide>
								<div class="flex juex">
									<span>.{showCssSelectorText.key}</span>
									<button
										type="button"
										class="close-382x"
										on:click={() => {
											showCssSelectorText.key = false;
										}}><Icon style="width:100%" src={ChevronUp} /></button
									>
								</div>
								<textarea
									class="style-space"
									placeholder="Enter css styles here..."
									spellcheck="false"
									on:keyup={(e) => handleNewStyle(e, showCssSelectorText.key)}
									on:keydown={handleStyleKeyDown}>{showCssSelectorText.value}</textarea
								>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
		<FontsComponent
			{stylePropertiesInClass}
			{handleFontSize}
			{fontSizeInput}
			{RemHandleFontSize}
			{applyStyle}
		/>
	</div>
	<div>
		<div id="blw-style-content" />
		<div
			class="content-editor"
			id="blw-text-content"
			contenteditable="true"
			style="padding: 10px;"
			on:blur={updateText}
		>
			{@html editorContent}
		</div>
		<div class="context-menu" id="context-menu">
			{#if contextMenuToggler}
				<div class="menu-wrap" transition:slide>
					<section>
						<button type="button" on:click={addCssStyle}>
							<div>
								<Icon style="width: 23px;margin-right: 7px;" src={CodeBracketSquare} />
								Add CSS Styles
							</div>
						</button>
						<div class="wire" />
						<button type="button" on:click={() => dispatchButton('copy')}>
							<div>
								<Icon style="width: 23px;margin-right: 7px;" src={Clipboard} />
								Copy
							</div>
							<div class="shortcut">CTRL + C</div>
						</button>
						<button type="button" on:click={() => dispatchButton('cut')}>
							<div>
								<Icon style="width: 23px;margin-right: 7px;" src={Scissors} />
								Cut
							</div>
							<div class="shortcut">CTRL + X</div>
						</button>
						<button type="button" on:click={() => dispatchButton('paste')}>
							<div>
								<Icon style="width: 23px;margin-right: 7px;" src={ClipboardDocumentList} />
								Paste
							</div>
							<div class="shortcut">CTRL + V</div>
						</button>
					</section>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.selector-list {
		& button.sel392c,
		& button.close-382x {
			background: #6e6d6d30;
			color: inherit;
			border: 1px solid transparent;
		}
		& button.sel392c {
			border: none;
			margin: 2px;
			padding: 3px 10px;
			border-radius: 3px;
			&:hover {
				border-color: #6d6c6c6e;
			}
		}
		& button.close-382x {
			border-radius: 50% !important;
			width: 24px;
			height: 24px;
			padding: 2px !important;
			border: 1px solid rgba(138, 138, 138, 0.3019607843) !important;
			margin-left: 9px;
		}
		& span {
			font-family: consolas;
			display: block;
		}
		& textarea {
			border-radius: 9px;
			border: 1px solid #7878783d;
			background: #0b0b0b;
			background: var(--text-editor-bg);
			border: 1px solid var(--button-border);
		}
		& .juex {
			margin-top: 12px;
		}
	}
	.style-space {
		min-height: auto !important;
		height: 100px;
		max-width: 100%;
		font-family: consolas, monospace !important;
	}
	.content-editor {
		width: 100%;
		min-height: 200px;
		background: var(--text-editor-bg);
		padding: 32px 29px;
		border: 1px solid var(--button-border);
		border-radius: 9px;
		outline: none;
	}
	.context-menu {
		position: absolute;
		user-select: none;
		box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.2);
		border-radius: 9px;
		& .menu-wrap {
			backdrop-filter: blur(9px);
			padding: 5px;
			border-radius: 9px;
			background: var(--side-bar);
			border: 1px solid var(--button-border);
			color: inherit;
		}
		& section {
			& .shortcut {
				font-size: 11px;
				font-family: consolas;
				text-transform: lowercase;
			}
			& div {
				display: flex;
				align-items: center;
			}
			& button {
				background: none;
				font-size: 13px;
				font-weight: 500;
				display: flex;
				align-items: center;
				width: 205px;
				height: 31px;
				padding: 0;
				color: inherit;
				margin: 0;
				border: none;
				justify-content: space-between;
				padding: 0 5px;
				border-radius: 3px;
				&:hover {
					background: #6d6d6d1f;
				}
			}
		}
	}
</style>
