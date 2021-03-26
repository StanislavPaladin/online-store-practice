const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});


//переменные
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const body = document.querySelector('body');
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');
const scrollLinks = document.querySelectorAll('.scroll-link');
const cartCount = document.querySelector('.cart-count');
const modal = document.querySelector('.modal');
const modalInut = document.querySelectorAll('.modal-input')
//запрос к БД
const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw ('ошибка') + result.status;
	}
	return await result.json();
};

//основной объект корзины
const cart = {
	cartGoods: [],
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({
			id,
			name,
			price,
			count
		}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
			<td>${name}</td>
			<td>${price}$</td>
			<td><button class="cart-btn-minus">-</button></td>
			<td>${count}</td>
			<td><button class="cart-btn-plus">+</button></td>
			<td>${price * count}$</td>
			<td><button class="cart-btn-delete">x</button></td>
		</tr>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0);
		cartTableTotal.textContent = totalPrice + '$';
	},
	renderGender() {
		const totalCounter = this.cartGoods.reduce((sum, item) => {
			return sum + item.count;
		}, 0);

		cartCount.innerHTML = totalCounter;
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
		this.renderGender();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
					this.renderGender();
					this.renderCart();
				}
				break;
			}

		}
	},
	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
		this.renderGender();
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (!goodItem) {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({
					id,
					name,
					price
				}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1,
					});
					this.renderGender();
				});
		} else {
			this.plusGood(id);

		}
	},
};
cart.renderCart();
window.body.addEventListener('click', (e) => {
	const addToCart = e.target.closest('.add-to-cart');
	if (e.target.closest('.add-to-cart')) {

		cart.addCartGoods(addToCart.dataset.id);
		cart.renderCart();
	}
});

//слушатели внутри корзины, добавление и удаление 
modal.addEventListener('click', (e) => {
	const target = e.target;
	if (target.classList.contains('cart-btn-delete')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.deleteGood(id);
	}
	if (target.classList.contains('cart-btn-minus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.minusGood(id);
	}
	if (target.classList.contains('cart-btn-plus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.plusGood(id);
	}
	if (target.classList.contains('clear-cart__btn')) {
		cart.cartGoods.forEach(function (item) {
			cart.deleteGood(item.id);
			closeModal();
		});


	}
});
//функции, связанные с модалками
const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
};
const closeModal = () => {
	modalCart.classList.remove('show');
};
//слушатели для открытия и закрытия модалок
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
const scrollFunction = () => {
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
};
scrollFunction();
//первичный рендер карточек
getGoods().then(function (data) {});
//динамическое создание карточек
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
//рендер карточек
const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	cards.forEach(function (card) {
		longGoodsList.append(card);
	});
	document.body.classList.add('show-goods');
};
//слушатель, срабатывающий для view all
more.addEventListener('click', (event) => {
	event.preventDefault();
	scrollFunction();
	getGoods().then(renderCards);
});
//фильтрация карточек товаров по типам
const filterCards = function (field, value) {
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
};
//слушатель, активирующий фильтрацию карточек товаров по типам
navigationLink.forEach(function (link) {
	getGoods();
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
//слушатель view all
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
getGoods();

//AJAX запросы

const modalForm = document.querySelector('.modal-form');
const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});
const kek = document.createElement('span');

function clearMessage() {
	kek.remove();
}

modalForm.addEventListener('submit', e => {
	e.preventDefault();
	const formData = new FormData(modalForm);
	formData.append('Goods: ', JSON.stringify(cart.cartGoods));
	postData(formData)
		.then(response => {
			if (response.ok && cart.cartGoods.length !== 0) {
				closeModal();
				alert('Ваш заказ отправлен');
			} else if (cart.cartGoods.length === 0) {
				if (cart.cartGoods.length === 0) {
					modal.append(kek);
					kek.innerHTML = 'Вы не можете отправить пустую корзину!';
					setTimeout(clearMessage, 4000);
				}
			} else {
				throw new Error(response.status);
			}
		})
		.catch(error => {
			alert('Произошла ошибка');
			console.error(error);
		})
		.finally(() => {
			modalForm.reset();
			cart.cartGoods.forEach(function (item) {
				cart.deleteGood(item.id);
			});
		});
});