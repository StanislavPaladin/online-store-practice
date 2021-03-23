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
function closeModal () {
	modalCart.classList.remove('show');
}

body.addEventListener('click', (e) => {
	e.preventDefault();
	const target = e.target;
	if(target.matches('.button-cart') || target.matches('[data-cart]')) {
		openModal();
	} else if (target.matches('.modal-close') || target.matches('.overlay')) {
		closeModal();
	}
});
window.addEventListener('keydown', (e) => {
	if (e.code == 'Escape') {
		closeModal();
	}
});

//scroll smooth

const scrollLink = document.querySelectorAll('a.scroll-link');
function scrollFunction () {
	for (let i = 0; i < scrollLink.length; i++) {
		scrollLink[i].addEventListener('click', (event) => {
			event.preventDefault();
			const id = scrollLink[i].getAttribute('href');
			document.querySelector(id).scrollIntoView( {
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}
scrollFunction();