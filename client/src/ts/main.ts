(function () {
    const header = document.querySelector<HTMLElement>(".header")
    const popup = document.querySelector<HTMLElement>(".popup")
    const sidebar = document.querySelector<HTMLElement>(".sidebar")
    const skillsSwiper = document.querySelector<HTMLElement>(".home__skills-swiper")

    if (header) {
        header.addEventListener("click", (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            if (target.closest(".header__burger")) {
                const burger = target.closest<HTMLElement>(".header__burger")
                const nav = header.querySelector<HTMLElement>(".header__nav")

                document.body.classList.toggle("_lock")
                burger?.classList.toggle("_active")
                nav?.classList.toggle("_active")
            }
        })
    }

    if (popup) {
        document.addEventListener("click", (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            if (target.closest("[data-popup]")) {
                const selector = target.closest<HTMLElement>("[data-popup]")?.getAttribute("data-popup")
                if (!selector) return alert("data-popup does not exist")

                document.body.classList.add("_lock")
                popup.querySelector<HTMLElement>(`.popup__${escapeHTML(selector)}`)?.classList.add("_active")
                popup.classList.add("_active")

                window.dispatchEvent(new CustomEvent("popup-open"))
            }
        })

        popup.addEventListener("click", (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            if (target.closest("[data-close]") || target.classList.contains("popup__content")) {
                popup.classList.remove("_active")
                popup.querySelectorAll<HTMLElement>(".popup__content").forEach(el => el.classList.remove("_active"))
                document.body.classList.remove("_lock")

                window.dispatchEvent(new CustomEvent("popup-close"))
            }
        })

        window.addEventListener("popup-close", () => {
            const query = new URLSearchParams(window.location.search)
            if (!query.has("project")) return

            query.delete("project")
            const url = `${window.location.pathname}?${query.toString()}`

            window.history.replaceState("", "", url)
        })
    }

    if (sidebar) {
        document.addEventListener("click", (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            if (target.closest("[data-sidebar]")) {
                const selector = target.closest<HTMLElement>("[data-sidebar]")?.getAttribute("data-sidebar")
                if (!selector) return alert("data-sidebar does not exist")

                document.body.classList.add("_lock")
                sidebar.querySelector<HTMLElement>(`.sidebar__${escapeHTML(selector)}`)?.classList.add("_active")
                sidebar.classList.add("_active")

                window.dispatchEvent(new CustomEvent("sidebar-open"))
            }
        })

        sidebar.addEventListener("click", (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            if (target.closest("[data-close]") || target.classList.contains("sidebar__content")) {
                sidebar.classList.remove("_active")
                sidebar.querySelectorAll<HTMLElement>(".sidebar__content").forEach(el => el.classList.remove("_active"))
                document.body.classList.remove("_lock")

                window.dispatchEvent(new CustomEvent("sidebar-close"))
            }
        })
    }

    if (skillsSwiper) {
        const next = skillsSwiper.querySelector<HTMLElement>(".swiper-button-next")
        const prev = skillsSwiper.querySelector<HTMLElement>(".swiper-button-prev")
        const swiper = new Swiper(skillsSwiper, {
            navigation: {
                nextEl: next,
                prevEl: prev,
            },
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 1700,
            },
            speed: 700,
            slidesPerView: "auto",
            spaceBetween: 10,
            breakpoints: {
                499.98: {
                    spaceBetween: 15
                },
            }
        })
    }
})()