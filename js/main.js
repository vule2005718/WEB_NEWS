/* lưu thông tin để xác thực của dịch vụ EmailJS(tự động gửi email cho người đăng ký và lẫn người quan lý trang web) */
const EMAILJS_SERVICE_ID  = 'service_pk1epqr';
const EMAILJS_TEMPLATE_ID = 'template_xzr8bjl';
const EMAILJS_PUBLIC_KEY  = 'l-yLveUOrwBGYl8oT';
/* ──────────────────────────────────────────
   1. LOAD COMPONENT (Header / Footer)
────────────────────────────────────────── */
function loadComponent(id, url, callback) {
  /*id: id của phần tử đích để gán nội dung HTML sau khi fetch thành công
    url: đường dẫn đến file HTML của component cần load (ví dụ: './components/header.html')
    callback: hàm sẽ được gọi sau khi component load xong (thường dùng để khởi tạo các chức năng liên quan) */
  /*Lấy phần tử đích để gán nội dung HTML sau khi fetch thành công */
  const el = document.getElementById(id);
  /*Kiểm tra nếu phần tử đích tồn tại trên trang, nếu không thì dừng hàm và log lỗi */
  if (!el) return;

  fetch(url)/*trả về một Promise chứa response của request, sau đó chuyển response thành text (HTML)*/
    .then(r => r.text())/*trả về một Promise chứa nội dung HTML của component, sau đó gán vào innerHTML của phần tử đích*/
    .then(html => {/* Sau khi fetch thành công, gán nội dung HTML vào phần tử đích và gọi callback nếu có */
      el.innerHTML = html;/*gán nội dung HTML vào phần tử đích*/
      if (callback) callback();
      /* Sau khi load xong header → gọi callback để khởi tạo các chức năng liên quan (mobile menu, theme toggle, active nav, search) */
    })
    .catch(err => console.warn('Lỗi load component:', url, err));/* Xử lý lỗi nếu có */
}

/* ──────────────────────────────────────────
   2. THEME MANAGER (Dark / Light mode) khác với THEME TOGGLE BUTTONS ở chỗ:
- ThemeManager là đối tượng quản lý toàn bộ logic liên quan đến theme (lưu trữ, áp dụng, toggle)
- Theme Toggle Buttons chỉ là phần giao diện (nút bấm) để người dùng tương tác, nó sẽ gọi ThemeManager để thực hiện thay đổi theme
────────────────────────────────────────── */
/* ThemeManager: quản lý chế độ giao diện (sáng/tối) của trang web
- Lưu theme đã chọn vào localStorage để nhớ lựa chọn của người dùng
- Áp dụng theme bằng cách set attribute data-theme trên thẻ html
- Cập nhật trạng thái của nút toggle (opacity) dựa trên theme hiện tại */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('newspro-theme') || 'light';
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('newspro-theme', theme);
    const btnLight = document.getElementById('btnLight');
    const btnDark  = document.getElementById('btnDark');
    if (btnLight) btnLight.style.opacity = theme === 'light' ? '1' : '0.5';
    if (btnDark)  btnDark.style.opacity  = theme === 'dark'  ? '1' : '0.5';
  },
  toggle(theme) { this.apply(theme); }
};

/* ──────────────────────────────────────────
   3. MOBILE MENU (Hamburger) menu cho thiết bị di động và tablet
- Khi click vào hamburger → mở menu (thêm class active) và khóa scroll trang (overflow: hidden)
- Khi click ra ngoài menu hoặc vào nút đóng → đóng menu (bỏ class active) và mở lại scroll (overflow: auto)
- Menu sẽ được load vào phần tử có id 'mobileNav' trong header.html, nên phải gọi sau khi header load xong
────────────────────────────────────────── */
function openMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) {
    nav.classList.remove('active');
    document.body.style.overflow = '';
  }
}
/* initMobileMenu: khởi tạo menu di động bằng cách thêm nút hamburger vào header và gán sự kiện click để mở menu
- Tạo nút hamburger và thêm vào header
- Gán sự kiện click cho nút để mở menu
- Gán sự kiện click cho phần tử mobileNav để đóng menu khi click ra ngoài */
function initMobileMenu() {
  const headerInner = document.querySelector('.header-inner');
  if (!headerInner) return;

  const btn = document.createElement('button');
  btn.className = 'hamburger-btn';
  btn.id = 'menuToggle';
  btn.setAttribute('aria-label', 'Mở menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  btn.addEventListener('click', openMobileNav);
  headerInner.appendChild(btn);

  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });
  }
}

/* ──────────────────────────────────────────
   4. THEME TOGGLE BUTTONS giao diện dùng để chuyển đổi giữa chế độ sáng và tối
- Khi click vào nút Light → chuyển sang theme sáng và cập nhật trạng thái nút
- Khi click vào nút Dark → chuyển sang theme tối và cập nhật trạng thái nút
- Nút sẽ được load vào phần tử có id 'themeToggle' trong header.html, nên phải gọi sau khi header load xong
────────────────────────────────────────── */
function initThemeToggle() {
  const btnLight = document.getElementById('btnLight');
  const btnDark  = document.getElementById('btnDark');
  const saved    = localStorage.getItem('newspro-theme') || 'light';

  if (btnLight) btnLight.style.opacity = saved === 'light' ? '1' : '0.5';
  if (btnDark)  btnDark.style.opacity  = saved === 'dark'  ? '1' : '0.5';

  if (btnLight) btnLight.addEventListener('click', () => ThemeManager.toggle('light'));
  if (btnDark)  btnDark.addEventListener('click',  () => ThemeManager.toggle('dark'));
}

/* ──────────────────────────────────────────
   5. ACTIVE NAV
────────────────────────────────────────── */
/* initActiveNav: xác định trang hiện tại dựa trên URL và thêm class 'active' vào item tương ứng trong navigation */
function initActiveNav() {
  const path = window.location.pathname;

  /* Xác định nếu đang ở trang chủ (index.html hoặc / hoặc /News/) thì item 'home' sẽ được active */
  const isHome = path.endsWith('index.html') ||
                 path === '/' ||
                 path.endsWith('/News/')

  document.querySelectorAll('.nav-item, .mobile-nav__item').forEach(item => {
    item.classList.remove('active');
    const page = item.dataset.page || '';

    if (page === 'home' && isHome) {
      item.classList.add('active');
    } else if (page && page !== 'home' && path.includes(page)) {
      item.classList.add('active');
    }
  });
}

/* ──────────────────────────────────────────
   6. HERO STRIP — Swiper strip các bài viết nổi bật ở đầu trang chủ
────────────────────────────────────────── */
function initHeroStrip() {
  const track   = document.getElementById('heroStripTrack');
  const prevBtn = document.getElementById('heroStripPrev');
  const nextBtn = document.getElementById('heroStripNext');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.hero-strip__card'));
  const GAP   = 20;
  let offset  = 0;


  /* visibleCount: tính số card có thể hiển thị trong viewport hiện tại dựa trên kích thước của track và card */
  function visibleCount() {
    const vpW   = track.parentElement.offsetWidth;
    const cardW = cards[0] ? cards[0].offsetWidth + GAP : 200;
    return Math.round(vpW / cardW);
  }

  /* slideTo: chuyển đến slide có offset n, với logic vòng lặp (nếu n < 0 thì về cuối, nếu n > max thì về đầu) */
  function slideTo(n) {
    const max = Math.max(0, cards.length - visibleCount());
    if (n < 0)       offset = max;
    else if (n > max) offset = 0;
    else             offset = n;

    const cardW = cards[0] ? cards[0].offsetWidth + GAP : 0;
    track.style.transform = `translateX(-${offset * cardW}px)`;
  }


  if (prevBtn) prevBtn.addEventListener('click', () => slideTo(offset - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => slideTo(offset + 1));

  /* Tự động slide mỗi 4 giây, nhưng dừng khi hover vào track và tiếp tục khi hover ra ngoài */
  let autoSlide = setInterval(() => slideTo(offset + 1), 4000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => slideTo(offset + 1), 4000);
  });

  slideTo(0);/* Hiển thị slide đầu tiên */
  window.addEventListener('resize', () => slideTo(offset));/* Cập nhật lại vị trí slide khi resize để đảm bảo luôn hiển thị đúng số card phù */
}

/* ──────────────────────────────────────────
   7. HOME TABS xử lý sự kiện click trên các tab trong phần Home Section để chuyển đổi nội dung hiển thị
────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.home-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.home-section__header');
      if (group) {
        group.querySelectorAll('.home-tab').forEach(t => t.classList.remove('active'));
      }
      tab.classList.add('active');
    });
  });
}

/* ──────────────────────────────────────────
   8. DOTS PAGINATION phần slider trong Category Featured Section, xử lý sự kiện click trên các dot để chuyển đổi slide tương ứng
────────────────────────────────────────── */
function initDots() {
    const slides = document.querySelectorAll('.nf-item');
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // bỏ active tất cả slide
            slides.forEach(slide =>
                slide.classList.remove('active')
            );
            // bỏ active tất cả dot
            dots.forEach(d =>
                d.classList.remove('active')
            );
            // active slide tương ứng
            slides[index].classList.add('active');
            // active dot tương ứng
            dot.classList.add('active');
        });

    });
}

/* ──────────────────────────────────────────
   9. LAZY LOAD ẢNH sử dụng IntersectionObserver để theo dõi khi nào ảnh xuất hiện trong viewport,
  sau đó mới tải ảnh đó (bằng cách gán src từ data-src) để tiết kiệm băng thông và tăng tốc độ tải trang
────────────────────────────────────────── */
function initLazyLoad() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  } else {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  }
}

/* ══════════════════════════════════════════
   10. NEWSLETTER FORM — jQuery + Bootstrap 5 Validation + EmailJS
══════════════════════════════════════════ */
function initNewsletter() {
  // Chờ jQuery load
  if (typeof $ === 'undefined') {
    setTimeout(initNewsletter, 100);
    return;
  }

  const $input = $('.newsletter-section__input');
  const $btn   = $('.newsletter-section__btn');
  if (!$btn.length || !$input.length) return;

  // Thêm feedback elements nếu chưa có
  if (!$('.newsletter-feedback').length) {
    $btn.after('<div class="newsletter-feedback"></div>');
  }

  // jQuery validation
  $btn.on('click', function () {
    const email = $input.val().trim();

    // Reset trạng thái
    $input.removeClass('is-invalid is-valid');
    $('.newsletter-feedback').html('').hide();

    // Validate email với regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showNewsletterError('Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    if (!emailRegex.test(email)) {
      showNewsletterError('Email không hợp lệ. Ví dụ: name@example.com');
      return;
    }

    // Email hợp lệ → gửi qua EmailJS
    $input.addClass('is-valid');
    $btn.prop('disabled', true).html('⏳');

    sendNewsletterEmail(email);
  });

  // Xóa lỗi khi người dùng gõ lại
  $input.on('input', function () {
    $(this).removeClass('is-invalid is-valid');
    $('.newsletter-feedback').hide();
  });

  // Enter key
  $input.on('keydown', function (e) {
    if (e.key === 'Enter') $btn.trigger('click');
  });
}

function showNewsletterError(msg) {
  $('.newsletter-section__input').addClass('is-invalid');
  $('.newsletter-feedback')
    .html('<span style="color:#dc3545;font-size:12px;font-weight:600;">⚠ ' + msg + '</span>')
    .show();
}

function showNewsletterSuccess(email) {
  const $btn = $('.newsletter-section__btn');
  $btn.prop('disabled', false).html('✓');
  $('.newsletter-feedback')
    .html('<span style="color:#28a745;font-size:12px;font-weight:600;">✅ Đăng ký thành công! Cảm ơn bạn.</span>')
    .show();

  // Bootstrap 5 toast notification
  showToast(`📧 Đã đăng ký nhận tin với email: ${email}`, 'success');

  setTimeout(() => {
    $('.newsletter-section__input').val('').removeClass('is-valid');
    $btn.html('→');
    $('.newsletter-feedback').fadeOut();
  }, 4000);
}

/* ── EmailJS Integration ── */
function sendNewsletterEmail(email) {
  // Kiểm tra EmailJS đã load chưa
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS chưa được load. Hiển thị mock success.');
    showNewsletterSuccess(email);
    return;
  }

  // Cấu hình EmailJS — THAY THẾ bằng thông tin thực của bạn:
  // 1. Đăng ký tại https://www.emailjs.com/
  // 2. Tạo Email Service → lấy SERVICE_ID
  // 3. Tạo Email Template → lấy TEMPLATE_ID
  // 4. Lấy PUBLIC_KEY từ Account > API Keys
  // Dùng các biến đã khai báo ở đầu file
  emailjs.init(EMAILJS_PUBLIC_KEY);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    user_email: email,
    to_name: 'NewsPro Team',
    message: `Có người đăng ký nhận tin tức mới: ${email}`
  })
  .then(() => {
    showNewsletterSuccess(email);
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    // Nếu chưa cấu hình key → vẫn hiển thị success (demo)
    showNewsletterSuccess(email);
  });
}

/* ══════════════════════════════════════════
   11. TÌM KIẾM (SEARCH) — jQuery
   Dữ liệu bài viết mẫu để demo chức năng
══════════════════════════════════════════ */

// Dataset bài viết để search (có thể thay bằng API call)
const NEWS_DATA = [
  { title: 'Sơn Tùng M-TP ra mắt MV mới gây bão mạng xã hội', category: 'Âm Nhạc', url: './pages/music.html', img: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/4/26/1184769/1AAD455A-C5C7-41BD-9.jpeg' },
  { title: 'Ninh Dương Lan Ngọc chia sẻ hành trình 10 năm làm nghề', category: 'Giải Trí', url: './pages/entertainment.html', img: 'https://images2.thanhnien.vn/528068263637045248/2023/4/14/edit-lan-ngoc--1681439195640898341745.png' },
  { title: 'Trần Thành hé lộ dự án phim mới quy tụ dàn cast khủng', category: 'Giải Trí', url: './pages/entertainment.html', img: 'https://vcdn1-giaitri.vnecdn.net/2025/02/03/tran-thanh-bo-tu-1-1738572656-9426-1738572968.jpg' },
  { title: 'BLACKPINK xác nhận tái hợp, chuẩn bị tour thế giới 2026', category: 'Âm Nhạc', url: './pages/music.html', img: 'https://asset-cdn.yeah1.com/images/DSC_01298_5e6cb40f3b.jpg' },
  { title: 'James Cameron bị kiện vì dùng hình ảnh trái phép', category: 'Phim Ảnh', url: './pages/movie.html', img: 'https://vcdn1-giaitri.vnecdn.net/2026/05/07/685173467-n-1778124478-4331-1778125624.jpg' },
  { title: 'Đỗ Long: Làm với sao quốc tế tài năng thôi chưa đủ', category: 'Thời Trang', url: './pages/fashion.html', img: 'https://vcdn1-giaitri.vnecdn.net/2026/05/09/NTKDOLONG-1778227449-8571-1778317132.jpg' },
  { title: 'Củng Lợi khoe sắc bên dàn sao mở màn LHP Cannes 2026', category: 'Thời Trang', url: './pages/fashion.html', img: 'https://vcdn1-giaitri.vnecdn.net/2026/05/13/cung-loi-cannes-2026-JPG-1778627318.jpg' },
  { title: 'HIEUTHUHAI lọt top nghệ sĩ trẻ được yêu thích nhất châu Á', category: 'Âm Nhạc', url: './pages/music.html', img: 'https://cdn.24h.com.vn/upload/2-2026/images/2026-04-30/hieuthuhai-2-1777539695-750-width1366height1366.jpg' },
  { title: 'Ronaldo bị đồng đội cản đường vô địch Saudi Pro League', category: 'Thể Thao', url: '#', img: 'https://vcdn1-thethao.vnecdn.net/2026/05/13/ronaldo-jpeg-1778617135-7151-1778617158.jpg' },
  { title: 'Trang Pháp - Chị đẹp được dân mạng Trung Quốc săn đón', category: 'Giải Trí', url: './pages/entertainment.html', img: 'https://asset-cdn.yeah1.com/images/trang_phap_dap_gio_2026_bzvn_7_19eb3209d7.jpg' },
  { title: 'Jun Phạm, Duy Khánh tái xuất Anh Trai Vượt Ngàn Chông Gai 2026', category: 'Giải Trí', url: './pages/entertainment.html', img: 'https://asset-cdn.yeah1.com/images/Poster_5_anh_size_1_1_174ba699de.jpg' },
  { title: 'Stand bánh mì tạo cơn sốt via hè Việt Nam', category: 'Đời Sống', url: './pages/lifestyle.html', img: 'https://vcdn1-giadinh.vnecdn.net/2026/05/13/a-nh-1778631243-9478-1778631290.jpg' },
  { title: 'Cuộc sống tại ngôi làng ẩm ướt nhất thế giới', category: 'Đời Sống', url: './pages/lifestyle.html', img: 'https://vcdn1-dulich.vnecdn.net/2018/08/03/1-1533284274.jpg' },
  { title: 'Tóc Tiên và Touliver xác nhận tham gia show thực tế mới', category: 'Giải Trí', url: './pages/entertainment.html', img: 'https://kenh14cdn.com/zoom/594_371/203336854389633024/2025/11/17/ava-tbtr-800-42-17633625822881888351608.png' },
  { title: 'Kết phim Bóng ma hạnh phúc gây tranh cãi trên mạng', category: 'Phim Ảnh', url: './pages/movie.html', img: 'https://vcdn1-giaitri.vnecdn.net/2026/05/10/sddefault-1778397899-4240-1778398214.jpg' },
];

function initSearch() {
  if (typeof $ === 'undefined') {
    setTimeout(initSearch, 100);
    return;
  }

  // Tạo dropdown search results container
  const $searchForm = $('.search-box');
  if (!$searchForm.length) return;

  // Thêm search results dropdown
  if (!$('#searchDropdown').length) {
    $searchForm.append(
      '<div id="searchDropdown" class="search-dropdown" style="display:none;"></div>'
    );
  }

  const $searchInput = $searchForm.find('input[type="text"]');
  const $searchBtn   = $searchForm.find('button[type="submit"]');
  const $dropdown    = $('#searchDropdown');

  // Live search khi gõ (debounce 300ms)
  let searchTimer;
  $searchInput.on('input', function () {
    clearTimeout(searchTimer);
    const query = $(this).val().trim();

    if (query.length < 2) {
      $dropdown.hide().empty();
      return;
    }

    searchTimer = setTimeout(() => performSearch(query, $dropdown), 300);
  });

  // Submit form → redirect hoặc show results
  $searchBtn.on('click', function (e) {
    e.preventDefault();
    const query = $searchInput.val().trim();
    if (query.length >= 2) {
      performSearch(query, $dropdown);
      $dropdown.show();
    }
  });

  $searchInput.on('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      $searchBtn.trigger('click');
    }
    if (e.key === 'Escape') {
      $dropdown.hide().empty();
    }
  });

  // Đóng dropdown khi click ra ngoài
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.search-box').length) {
      $dropdown.hide();
    }
  });
}

function performSearch(query, $dropdown) {
  const q = query.toLowerCase();
  const results = NEWS_DATA.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  );

  $dropdown.empty();

  if (results.length === 0) {
    $dropdown.html(
      '<div class="search-no-result">Không tìm thấy kết quả cho "<strong>' + escapeHtml(query) + '</strong>"</div>'
    ).show();
    return;
  }

  // Hiển thị tối đa 6 kết quả
  const items = results.slice(0, 6);
  items.forEach(item => {
    const $item = $('<a class="search-result-item" href="' + item.url + '">' +
      '<img src="' + item.img + '" alt="" onerror="this.src=\'https://placehold.co/64x48/e8e8e8/999?text=News\'"/>' +
      '<div class="search-result-info">' +
        '<span class="search-result-cat">' + item.category + '</span>' +
        '<span class="search-result-title">' + highlightText(item.title, query) + '</span>' +
      '</div>' +
    '</a>');
    $dropdown.append($item);
  });

  if (results.length > 6) {
    $dropdown.append(
      '<div class="search-view-all">Xem thêm ' + (results.length - 6) + ' kết quả...</div>'
    );
  }

  $dropdown.show();
}

function highlightText(text, query) {
  const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ══════════════════════════════════════════
   12. TOAST NOTIFICATIONS — Hiển thị thông báo dạng toast ở góc dưới bên phải khi có sự kiện quan trọng (ví dụ: đăng ký newsletter thành công)
   - Tự động ẩn sau 4 giây
   - Có thể có nhiều toast cùng lúc, xếp chồng lên nhau
   - Dùng Bootstrap 5 Toast nếu có, fallback nếu không
══════════════════════════════════════════ */
function initToastContainer() {
  if ($('#toastContainer').length) return;
  $('body').append(
    '<div id="toastContainer" aria-live="polite" aria-atomic="true" ' +
    'style="position:fixed;bottom:24px;right:24px;z-index:9999;min-width:300px;"></div>'
  );
}

function showToast(message, type = 'success') {
  if (typeof $ === 'undefined') return;
  initToastContainer();

  const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-primary';
  const toastId = 'toast_' + Date.now();

  const $toast = $(
    '<div id="' + toastId + '" class="toast align-items-center text-white ' + bgClass + ' border-0" ' +
    'role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="4000">' +
      '<div class="d-flex">' +
        '<div class="toast-body" style="font-size:14px;font-weight:600;">' + message + '</div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
      '</div>' +
    '</div>'
  );

  $('#toastContainer').append($toast);

  // Dùng Bootstrap 5 Toast API nếu có, fallback nếu không
  if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
    const bsToast = new bootstrap.Toast($toast[0]);
    bsToast.show();
    $toast[0].addEventListener('hidden.bs.toast', () => $toast.remove());
  } else {
    // Fallback animation
    $toast.css({ opacity: 0, transform: 'translateX(100%)' })
          .show()
          .animate({ opacity: 1 }, 300);
    $toast.css('transform', 'translateX(0)');
    setTimeout(() => {
      $toast.animate({ opacity: 0 }, 300, () => $toast.remove());
    }, 4000);
  }
}

/* ══════════════════════════════════════════
   13. CATEGORY FEATURED SLIDER
   - Nhóm mỗi 2 nf-item thành 1 slide (tự động)
   - Tạo dots-nav theo số slide thực tế
   - Click dot chuyển slide, transition mượt
   - Dùng jQuery
══════════════════════════════════════════ */
function initCategorySlider(selector) {
  var $slider = $(selector);
  if (!$slider.length) return;
 
  var $slides = $slider.find('.category-slide');
  var $dotsContainer = $slider.find('.category-slider__dots');
  var total = $slides.length;
  var current = 0;
 
  if (total === 0) return;
 
  /* Tạo dots theo số slide thực tế */
  $dotsContainer.empty();
  for (var i = 0; i < total; i++) {
    var $dot = $('<span class="dot"></span>');
    if (i === 0) $dot.addClass('active');
    $dotsContainer.append($dot);
  }
 
  /* Hàm chuyển slide */
  function goTo(index) {
    if (index < 0 || index >= total) return;
    $slides.removeClass('active');
    $slides.eq(index).addClass('active');
    $dotsContainer.find('.dot').removeClass('active');
    $dotsContainer.find('.dot').eq(index).addClass('active');
    current = index;
  }
 
  /* Click dot */
  $dotsContainer.on('click', '.dot', function () {
    var idx = $(this).index();
    goTo(idx);
  });
 
  /* Hiển thị slide đầu tiên */
  goTo(0);
}
 
/* ══════════════════════════════════════════
   14. SIDEBAR HOVER EXPAND (ĐỌC NHIỀU)
   - Mặc định: chỉ title
   - Hover item → mở expand (ảnh + tag)
   - Chỉ 1 item mở tại một thời điểm
   - Dùng jQuery + CSS transitions (max-height, opacity, transform)
══════════════════════════════════════════ */
function initSidebarHover() {
  var $items = $('.sidebar-block__item');
  if (!$items.length) return;
 
  $items.on('mouseenter', function () {
    var $this = $(this);
    /* Đóng tất cả item khác */
    $items.not($this).removeClass('is-open');
    /* Mở item hiện tại */
    $this.addClass('is-open');
  });
 
  $items.on('mouseleave', function () {
    $(this).removeClass('is-open');
  });
}


/* ══════════════════════════════════════════
   KHỞI TẠO KHI TRANG LOAD XONG
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  initHeroStrip();
  initTabs();
  initDots('.articles-slider');
  initLazyLoad();
  initNewsletter();
  initSearch();
});

/* ══════════════════════════════════════════
   GỌI SAU KHI HEADER LOAD XONG
══════════════════════════════════════════ */
function onHeaderLoaded() {
  initMobileMenu();
  initThemeToggle();
  initActiveNav();
  initSearch(); // Khởi tạo lại search sau khi header load xong
}