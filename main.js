/**
 * AI公益课堂 - 主JavaScript文件
 * 包含所有交互功能和动画效果
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化各个功能模块
    initPreloader();
    initNavigation();
    initScrollEffects();
    initGalleryEffects();
    initCourseSlider();
    initRippleEffects();
    initTouchSupport();
    initLazyLoading();
    initAccessibilityTools();
});

// ================= 页面预加载动画 =================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    // 页面加载完成后淡出预加载动画
    setTimeout(() => {
        preloader.classList.add('fade-out');
        // 完全移除预加载器，释放内存
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }, 800);
    
    // 监听所有图片加载状态
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    const imageLoaded = () => {
        loadedImages++;
        // 根据加载进度更新预加载动画
        if (loadedImages === images.length) {
            // 所有图片加载完成
            preloader.classList.add('fade-out');
        }
    };
    
    // 检查每张图片的加载状态
    images.forEach(image => {
        if (image.complete) {
            imageLoaded();
        } else {
            image.addEventListener('load', imageLoaded);
            image.addEventListener('error', imageLoaded); // 即使加载失败也继续
        }
    });
}

// ================= 导航交互 =================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (!navbar || !hamburger || !navLinksContainer) return;
    
    // 汉堡菜单点击事件
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        
        // 添加菜单打开/关闭动画
        if (navLinksContainer.classList.contains('active')) {
            // 菜单打开时依次显示每个链接项
            navLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0)';
                }, 100 * index);
            });
        } else {
            // 菜单关闭时重置样式
            navLinks.forEach(link => {
                link.style.opacity = '';
                link.style.transform = '';
            });
        }
    });
    
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 阻止默认行为以使用平滑滚动
            e.preventDefault();
            
            // 获取目标元素
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // 滚动到目标位置
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // 减去导航栏高度
                    behavior: 'smooth'
                });
                
                // 更新URL但不刷新页面
                history.pushState(null, null, targetId);
                
                // 在移动模式下点击链接后关闭菜单
                if (window.innerWidth <= 768) {
                    navLinksContainer.classList.remove('active');
                }
                
                // 更新活动链接状态
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 调整窗口大小时处理菜单状态
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
        }
    });
}

// ================= 滚动效果 =================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const revealSections = document.querySelectorAll('.section-reveal');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // 滚动监听函数
    const checkScroll = () => {
        // 检查导航栏
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 检查section显示动画
        revealSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
                
                // 查找并激活section内的淡入元素
                const fadeElements = section.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up');
                fadeElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, 100 + 150 * index); // 依次添加延迟，创造序列动画效果
                });
            }
        });
        
        // 检查当前部分以高亮导航链接
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (
                scrollPosition >= sectionTop - 100 &&
                scrollPosition < sectionTop + sectionHeight - 100
            ) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    // 初始检查
    checkScroll();
    
    // 使用节流函数优化滚动事件
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                checkScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // 回到顶部按钮功能
    const createBackToTopButton = () => {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.classList.add('back-to-top', 'ripple');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
        
        // 显示/隐藏按钮
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // 点击事件
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    createBackToTopButton();
}

// ================= 图廊效果 =================
function initGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const gallery = document.querySelector('.gallery-container');
    
    if (!galleryItems.length || !gallery) return;
    
    // 暂停画廊动画当鼠标悬停时
    gallery.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    gallery.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
    
    // 给图廊项添加鼠标移动倾斜效果
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 计算倾斜角度，最大为5度
            const tiltX = (y / rect.height * 10 - 5).toFixed(2);
            const tiltY = ((x / rect.width * 10 - 5) * -1).toFixed(2);
            
            // 应用transform
            this.style.transform = `scale(1.1) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            // 添加光影效果
            const glare = this.querySelector('.glare') || document.createElement('div');
            if (!this.querySelector('.glare')) {
                glare.classList.add('glare');
                this.appendChild(glare);
            }
            
            // 根据鼠标位置更新光影效果
            const glareX = (x / rect.width * 100).toFixed(2);
            const glareY = (y / rect.height * 100).toFixed(2);
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
        });
        
        // 鼠标离开时恢复原状
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateX(0) rotateY(0)';
            const glare = this.querySelector('.glare');
            if (glare) glare.remove();
        });
        
        // 添加点击放大功能
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const caption = this.querySelector('.gallery-caption').textContent;
            
            // 创建全屏查看器
            const viewer = document.createElement('div');
            viewer.classList.add('fullscreen-viewer');
            viewer.innerHTML = `
                <div class="viewer-content">
                    <img src="${imgSrc}" alt="${caption}">
                    <p>${caption}</p>
                    <button class="close-viewer"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            document.body.appendChild(viewer);
            document.body.style.overflow = 'hidden';
            
            // 淡入效果
            setTimeout(() => {
                viewer.classList.add('active');
            }, 10);
            
            // 关闭按钮事件
            viewer.querySelector('.close-viewer').addEventListener('click', () => {
                viewer.classList.remove('active');
                setTimeout(() => {
                    viewer.remove();
                    document.body.style.overflow = '';
                }, 300);
            });
            
            // 点击背景也关闭
            viewer.addEventListener('click', function(e) {
                if (e.target === this) {
                    viewer.classList.remove('active');
                    setTimeout(() => {
                        viewer.remove();
                        document.body.style.overflow = '';
                    }, 300);
                }
            });
        });
    });
}

// ================= 课程滑块 =================
function initCourseSlider() {
    const courseCards = document.querySelectorAll('.course-card');
    const dots = document.querySelectorAll('.slider-dot');
    const courseSlider = document.querySelector('.course-slider');
    let currentCard = 0;
    let cardInterval;
    
    if (!courseCards.length || !dots.length || !courseSlider) return;
    
    // 显示指定卡片
    const showCard = (index) => {
        // 添加退出动画
        courseCards[currentCard].classList.add('slide-out');
        
        setTimeout(() => {
            courseCards.forEach(card => {
                card.classList.remove('active', 'slide-out');
            });
            dots.forEach(dot => dot.classList.remove('active'));
            
            courseCards[index].classList.add('active');
            dots[index].classList.add('active');
            currentCard = index;
        }, 300);
    };
    
    // 自动轮播
    const startAutoSlide = () => {
        cardInterval = setInterval(() => {
            currentCard = (currentCard + 1) % courseCards.length;
            showCard(currentCard);
        }, 6000);
    };
    
    startAutoSlide();
    
    // 点击导航点切换卡片
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            clearInterval(cardInterval);
            const index = parseInt(this.getAttribute('data-index'));
            showCard(index);
            startAutoSlide();
        });
    });
    
    // 鼠标悬停暂停自动轮播
    courseSlider.addEventListener('mouseenter', () => {
        clearInterval(cardInterval);
    });
    
    courseSlider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // 添加键盘导航支持
    courseSlider.setAttribute('tabindex', '0');
    courseSlider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearInterval(cardInterval);
            currentCard = (currentCard - 1 + courseCards.length) % courseCards.length;
            showCard(currentCard);
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            clearInterval(cardInterval);
            currentCard = (currentCard + 1) % courseCards.length;
            showCard(currentCard);
            startAutoSlide();
        }
    });
}

// ================= 波纹效果 =================
function initRippleEffects() {
    const rippleElements = document.querySelectorAll('.ripple');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // 根据元素大小调整波纹尺寸
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size * 2}px`;
            ripple.style.marginLeft = ripple.style.marginTop = `-${size}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ================= 触摸支持 =================
function initTouchSupport() {
    const courseSlider = document.querySelector('.course-slider');
    const courseCards = document.querySelectorAll('.course-card');
    const gallery = document.querySelector('.gallery-container');
    
    if (courseSlider && courseCards.length) {
        let touchStartX = 0;
        let touchEndX = 0;
        let currentCard = 0;
        
        // 查找当前活动卡片的索引
        const updateCurrentCardIndex = () => {
            courseCards.forEach((card, index) => {
                if (card.classList.contains('active')) {
                    currentCard = index;
                }
            });
        };
        
        // 处理轮播图的触摸滑动
        courseSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            updateCurrentCardIndex();
        }, false);
        
        courseSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        const handleSwipe = () => {
            const dots = document.querySelectorAll('.slider-dot');
            
            if (touchEndX < touchStartX - 50) {
                // 向左滑动，显示下一张
                const nextCard = (currentCard + 1) % courseCards.length;
                courseCards.forEach(card => card.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                courseCards[nextCard].classList.add('active');
                dots[nextCard].classList.add('active');
            }
            
            if (touchEndX > touchStartX + 50) {
                // 向右滑动，显示上一张
                const prevCard = (currentCard - 1 + courseCards.length) % courseCards.length;
                courseCards.forEach(card => card.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                courseCards[prevCard].classList.add('active');
                dots[prevCard].classList.add('active');
            }
        };
    }
    
    // 为视频项添加触摸反馈
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('touchstart', () => {
            item.classList.add('touched');
        });
        
        item.addEventListener('touchend', () => {
            setTimeout(() => {
                item.classList.remove('touched');
            }, 200);
        });
    });
}

// ================= 懒加载图片 =================
function initLazyLoading() {
    // 如果浏览器支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                    
                    // 图片加载动画
                    img.style.opacity = '0';
                    img.addEventListener('load', () => {
                        img.style.transition = 'opacity 0.5s ease';
                        img.style.opacity = '1';
                    });
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级方案：简单的滚动事件
        const lazyLoad = () => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
            
            // 如果所有图片都已加载，移除事件监听
            if (lazyImages.length === 0) {
                window.removeEventListener('scroll', lazyLoad);
            }
        };
        
        window.addEventListener('scroll', lazyLoad);
        lazyLoad(); // 初始加载
    }
}

// ================= 辅助功能工具 =================
function initAccessibilityTools() {
    // 创建辅助工具栏
    const createAccessibilityBar = () => {
        const accessBar = document.createElement('div');
        accessBar.classList.add('accessibility-bar');
        accessBar.innerHTML = `
            <button class="access-toggle" title="辅助功能选项"><i class="fas fa-universal-access"></i></button>
            <div class="access-options">
                <button class="text-size-increase" title="增大字体"><i class="fas fa-plus"></i> 字体</button>
                <button class="text-size-decrease" title="减小字体"><i class="fas fa-minus"></i> 字体</button>
                <button class="contrast-toggle" title="高对比度"><i class="fas fa-adjust"></i> 对比度</button>
                <button class="read-aloud" title="朗读内容"><i class="fas fa-volume-up"></i> 朗读</button>
            </div>
        `;
        
        document.body.appendChild(accessBar);
        
        // 切换工具栏显示/隐藏
        const toggle = accessBar.querySelector('.access-toggle');
        const options = accessBar.querySelector('.access-options');
        
        toggle.addEventListener('click', () => {
            accessBar.classList.toggle('expanded');
            if (accessBar.classList.contains('expanded')) {
                options.style.display = 'flex';
                setTimeout(() => {
                    options.style.opacity = '1';
                }, 10);
            } else {
                options.style.opacity = '0';
                setTimeout(() => {
                    options.style.display = 'none';
                }, 300);
            }
        });
        
        // 字体大小调整
        let currentFontSize = 100;
        const textIncrease = accessBar.querySelector('.text-size-increase');
        const textDecrease = accessBar.querySelector('.text-size-decrease');
        
        textIncrease.addEventListener('click', () => {
            if (currentFontSize < 150) {
                currentFontSize += 10;
                document.body.style.fontSize = `${currentFontSize}%`;
            }
        });
        
        textDecrease.addEventListener('click', () => {
            if (currentFontSize > 70) {
                currentFontSize -= 10;
                document.body.style.fontSize = `${currentFontSize}%`;
            }
        });
        
        // 高对比度模式
        const contrastToggle = accessBar.querySelector('.contrast-toggle');
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
        
        // 朗读功能（如果浏览器支持）
        const readAloud = accessBar.querySelector('.read-aloud');
        
        if ('speechSynthesis' in window) {
            readAloud.addEventListener('click', () => {
                // 如果正在朗读，则停止
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    readAloud.innerHTML = '<i class="fas fa-volume-up"></i> 朗读';
                    return;
                }
                
                readAloud.innerHTML = '<i class="fas fa-stop"></i> 停止';
                
                // 获取当前可见部分的文本内容
                const sections = document.querySelectorAll('section');
                let currentSection;
                
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
                        currentSection = section;
                    }
                });
                
                if (currentSection) {
                    const textToRead = currentSection.textContent.replace(/\s+/g, ' ').trim();
                    const utterance = new SpeechSynthesisUtterance(textToRead);
                    utterance.lang = 'zh-CN';
                    utterance.rate = 0.9;
                    
                    utterance.onend = () => {
                        readAloud.innerHTML = '<i class="fas fa-volume-up"></i> 朗读';
                    };
                    
                    window.speechSynthesis.speak(utterance);
                }
            });
        } else {
            readAloud.disabled = true;
            readAloud.title = '您的浏览器不支持朗读功能';
        }
    };
    
    createAccessibilityBar();
} 
