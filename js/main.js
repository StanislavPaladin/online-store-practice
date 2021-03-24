const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});


//cart
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const body = document.querySelector('body');

function openModal() {
	modalCart.classList.add('show');
}

function closeModal() {
	modalCart.classList.remove('show');
}

body.addEventListener('click', (e) => {
	const target = e.target;
	if (target.matches('.button-cart') || target.matches('[data-cart]')) {
		e.preventDefault();
		openModal();
	} else if (target.matches('.modal-close') || target.matches('.overlay')) {
		e.preventDefault();
		closeModal();
	}
});
window.addEventListener('keydown', (e) => {
	if (e.code == 'Escape') {
		closeModal();
	}
});

//scroll smooth

const scrollLinks = document.querySelectorAll('.scroll-link');

function scrollFunction() {
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', (event) => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}
scrollFunction();

//goods

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw ('ошибка') + result.status;
	}
	return await result.json();
};
getGoods().then(function (data) {});

const createCard = function ({
	label,
	name,
	img,
	description,
	id,
	price
}) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
		<div class="goods-card">
		${label ?
			`<span class="label">${label}</span>`  :
			''}
	<img src="/db/${img}" alt="i${name}" class="goods-image">
	<h3 class="goods-title">${name}</h3>
	<p class="goods-description">${description}</p>
	<button class="button goods-card-btn add-to-cart" data-id="${id}">
		<span class="button-price">$${price}</span>
	</button>
</div>
<!-- /.goods-card -->
	`;
	return card;
};

const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	cards.forEach(function (card) {
		longGoodsList.append(card);
	});
	document.body.classList.add('show-goods');
};
more.addEventListener('click', function (event) {
	event.preventDefault();
	scrollFunction();
	getGoods().then(renderCards);
	
});

const filterCards = function (field, value) {
	getGoods().then(function (data) {
			const result = data.filter(function (good) {
				return good[field] === value;
			});
			return result;
		})
		.then(renderCards);
};

navigationLink.forEach(function (link) {
	link.addEventListener('click', function (event) {
		event.preventDefault();
		let field = link.dataset.field;
		let value = link.textContent;
		if (field) {
			filterCards(field, value);
		} else {
			getGoods().then(renderCards);
		}
	});
});

const viewAllBtn = document.querySelectorAll('.view-all-btn');
viewAllBtn.forEach(function (link) {
	link.addEventListener('click', function (event) {
		event.preventDefault();
		let field = link.dataset.field;
		let value = link.dataset.category;
		if (field) {
			filterCards(field, value);
		} else {
			getGoods().then(renderCards);
			scrollFunction();
		}
	});
});