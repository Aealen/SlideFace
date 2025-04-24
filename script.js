const confirm = document.querySelector('.Confirm');
const boi = document.querySelector('.Boi');
const btnDelete = document.querySelector('.Confirm-Body-Button_Rej');
const btnCancel = document.querySelector('.Confirm-Body-Button_Acc');
const confirmBody = document.querySelector('.Confirm-Body');
const current = {
	happiness: 0.9,
	derp: 1,
	px: 0.5,
	py: 0.5
};
const target = { ...current };

confirm.addEventListener('mousemove', onMouseMove);
confirm.addEventListener('mouseleave', onMouseLeave);

function onMouseMove({ clientX: x, clientY: y }) {
	let dx1 = x - btnDelete.getBoundingClientRect().x - btnDelete.getBoundingClientRect().width * 0.5;
	let dy1 = y - btnDelete.getBoundingClientRect().y - btnDelete.getBoundingClientRect().height * 0.5;
	let dx2 = x - btnCancel.getBoundingClientRect().x - btnCancel.getBoundingClientRect().width * 0.5;
	let dy2 = y - btnCancel.getBoundingClientRect().y - btnCancel.getBoundingClientRect().height * 0.5;
	let px = (x - confirm.getBoundingClientRect().x) / confirm.getBoundingClientRect().width;
	let py = (y - confirm.getBoundingClientRect().y) / confirm.getBoundingClientRect().height;
	let distDelete = Math.sqrt(dx1 * dx1 + dy1 * dy1);
	let distCancel = Math.sqrt(dx2 * dx2 + dy2 * dy2);
	let happiness = Math.pow(distDelete / (distCancel + distDelete), 0.75);

	target.happiness = happiness;
	target.derp = 0;
	target.px = px;
	target.py = py;
}

function onMouseLeave() {
	target.happiness = 0.9;
	target.derp = 1;
	target.px = 0.5;
	target.py = 0.5;
}

function update() {
	for (let prop in target) {
		if (target[prop] === current[prop]) {
			continue;
		} else if (Math.abs(target[prop] - current[prop]) < 0.01) {
			current[prop] = target[prop];
		} else {
			current[prop] += (target[prop] - current[prop]) * 0.1;
		}
		boi.style.setProperty(`--${prop}`, current[prop]);
	}
	requestAnimationFrame(update);
}

update();

// 定义消息列表
let messages = [
	"1",
	"2",
	"3"
];

let currentMessageIndex = 0;

// 添加卸载按钮点击事件处理
btnDelete.addEventListener('click', function(e) {
	e.preventDefault();
	
	// 显示当前消息
	const messageElement = document.createElement('div');
	messageElement.className = 'message-box';
	messageElement.textContent = messages[currentMessageIndex];
	confirmBody.appendChild(messageElement);
	
	// 更新消息索引
	currentMessageIndex = (currentMessageIndex + 1) % messages.length;
	
	// 2秒后移除消息
	setTimeout(() => {
		messageElement.remove();
	}, 2000);
	
	// 获取确认框的尺寸
	const bodyRect = confirmBody.getBoundingClientRect();
	const buttonRect = btnDelete.getBoundingClientRect();
	const boiRect = boi.getBoundingClientRect();
	const cancelRect = btnCancel.getBoundingClientRect();
	
	// 计算可移动的范围（确保按钮不会超出确认框）
	const maxX = bodyRect.width - buttonRect.width;
	const maxY = bodyRect.height - buttonRect.height;
	
	// 定义安全区域（避免遮挡的区域）
	const safeZones = [
		{
			x: boiRect.x - bodyRect.x - buttonRect.width,
			y: boiRect.y - bodyRect.y - buttonRect.height,
			width: boiRect.width + buttonRect.width,
			height: boiRect.height + buttonRect.height
		},
		{
			x: cancelRect.x - bodyRect.x - buttonRect.width,
			y: cancelRect.y - bodyRect.y - buttonRect.height,
			width: cancelRect.width + buttonRect.width,
			height: cancelRect.height + buttonRect.height
		}
	];
	
	// 生成随机位置，直到找到不在安全区域内的位置
	let randomX, randomY;
	let isInSafeZone;
	
	do {
		randomX = Math.random() * maxX;
		randomY = Math.random() * maxY;
		
		// 检查是否在安全区域内
		isInSafeZone = safeZones.some(zone => 
			randomX >= zone.x && 
			randomX <= zone.x + zone.width && 
			randomY >= zone.y && 
			randomY <= zone.y + zone.height
		);
	} while (isInSafeZone);
	
	// 设置新位置
	btnDelete.style.position = 'absolute';
	btnDelete.style.left = randomX + 'px';
	btnDelete.style.top = randomY + 'px';
});

// 配置弹框相关元素
const settingsButton = document.querySelector('.Confirm-Header-Button_Settings');
const settingsModal = document.querySelector('.Settings-Modal');
const settingsClose = document.querySelector('.Settings-Close');
const settingsCancel = document.querySelector('.Settings-Cancel');
const settingsSave = document.querySelector('.Settings-Save');

// 配置表单元素
const pageTitleInput = document.getElementById('pageTitle');
const confirmHeaderTitleInput = document.getElementById('confirmHeaderTitle');
const confirmBodyTitleInput = document.getElementById('confirmBodyTitle');
const confirmButtonTextInput = document.getElementById('confirmButtonText');
const cancelButtonTextInput = document.getElementById('cancelButtonText');
const agreeModalTextInput = document.getElementById('agreeModalText');
const messagesListInput = document.getElementById('messagesList');

// 打开配置弹框
settingsButton.addEventListener('click', () => {
	// 设置当前值
	pageTitleInput.value = document.title;
	confirmHeaderTitleInput.value = document.querySelector('.Confirm-Header-Title').textContent;
	confirmBodyTitleInput.value = document.querySelector('.Confirm-Body-Title').textContent;
	confirmButtonTextInput.value = document.querySelector('.Confirm-Body-Button_Rej').textContent;
	cancelButtonTextInput.value = document.querySelector('.Confirm-Body-Button_Acc').textContent;
	messagesListInput.value = messages.join('\n');
	
	settingsModal.style.display = 'flex';
});

// 关闭配置弹框
function closeSettingsModal() {
	settingsModal.style.display = 'none';
}

settingsClose.addEventListener('click', closeSettingsModal);
settingsCancel.addEventListener('click', closeSettingsModal);

// 保存配置
settingsSave.addEventListener('click', () => {
	// 更新页面标题
	document.title = pageTitleInput.value;
	
	// 更新确认框标题
	document.querySelector('.Confirm-Header-Title').textContent = confirmHeaderTitleInput.value;
	
	// 更新确认框内容
	document.querySelector('.Confirm-Body-Title').textContent = confirmBodyTitleInput.value;
	
	// 更新按钮文本
	document.querySelector('.Confirm-Body-Button_Rej').textContent = confirmButtonTextInput.value;
	document.querySelector('.Confirm-Body-Button_Acc').textContent = cancelButtonTextInput.value;
	
	// 更新消息列表
	messages = messagesListInput.value.split('\n').filter(msg => msg.trim() !== '');
	currentMessageIndex = 0;
	
	// 添加保存成功的视觉反馈
	settingsSave.textContent = '保存成功！';
	settingsSave.style.backgroundColor = '#4CAF50';
	
	// 1秒后关闭弹窗并恢复按钮状态
	setTimeout(() => {
		closeSettingsModal();
		settingsSave.textContent = '保存';
		settingsSave.style.backgroundColor = '#4CAF50';
	}, 1000);
});

// 同意按钮点击事件
btnCancel.addEventListener('click', function(e) {
	e.preventDefault();
	
	// 创建并显示弹窗
	const modal = document.createElement('div');
	modal.className = 'Agree-Modal';
	modal.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	`;
	
	modal.innerHTML = `
		<div style="
			background-color: white;
			border-radius: 1rem;
			width: 400px;
			max-width: 90%;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		">
			<div style="
				padding: 1.5rem;
				border-bottom: 1px solid #eee;
				display: flex;
				justify-content: space-between;
				align-items: center;
			">
				<h2 style="margin: 0; font-size: 1.8rem;">提示</h2>
				<button class="modal-close" style="
					background: none;
					border: none;
					font-size: 2rem;
					cursor: pointer;
					color: #666;
				">×</button>
			</div>
			<div style="padding: 1.5rem; text-align: center;">
				<p style="margin: 0; font-size: 1.6rem; color: #333;">${agreeModalTextInput.value}</p>
			</div>
			<div style="
				padding: 1.5rem;
				border-top: 1px solid #eee;
				display: flex;
				justify-content: center;
			">
				<button class="modal-confirm" style="
					padding: 0.8rem 2rem;
					background-color: #4CAF50;
					color: white;
					border: none;
					border-radius: 0.5rem;
					font-size: 1.4rem;
					cursor: pointer;
				">确定</button>
			</div>
		</div>
	`;
	
	document.body.appendChild(modal);
	
	// 添加关闭事件
	const closeButton = modal.querySelector('.modal-close');
	const confirmButton = modal.querySelector('.modal-confirm');
	
	function closeModal() {
		modal.remove();
	}
	
	closeButton.addEventListener('click', closeModal);
	confirmButton.addEventListener('click', closeModal);
});