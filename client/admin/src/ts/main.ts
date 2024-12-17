(function () {
    const burger = document.querySelector<HTMLElement>(".admin-burger")
    const sidebar = document.querySelector<HTMLElement>(".sidebar")
    const popup = document.querySelector<HTMLElement>(".popup")
    const popupEdit = document.querySelector<HTMLElement>(".popup__edit")

    if (burger && sidebar) {
        burger.addEventListener("click", (e: MouseEvent): void => {
            document.body.classList.toggle("_lock")
            burger.classList.toggle("_active")
            sidebar.classList.toggle("_active")
        })

        sidebar.addEventListener("click", (e) => {
            const target = e.target as HTMLElement
            if (sidebar.classList.contains("_active") && !target.closest(".sidebar__inner")) {
                document.body.classList.remove("_lock")
                burger.classList.remove("_active")
                sidebar.classList.remove("_active")
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
    }

    if (popupEdit) {
        popupEdit.addEventListener("change", (e: Event): void => {
            const target = e.target as HTMLElement
            if (target.closest(".form-image__input")) {
                const formImage = target.closest<HTMLElement>(".form-image")
                if (!formImage) return alert('.form-image does not exist')

                const input = formImage.querySelector<HTMLInputElement>(".form-image__input")
                if (!input) return alert('.form-image__input does not exist')

                const img = formImage.querySelector<HTMLImageElement>(".form-image__img")
                if (!img) return alert('.form-image__img does not exist')

                if (!input.files || !input.files[0] || !inFileTypes(input) || input.files[0].size > 1024 * 1024) {
                    img.setAttribute("src", "#")
                    formImage.classList.remove("_active")
                    input.setAttribute("data-modified", String(1))
                    input.value = ""
                    return
                }

                const reader = new FileReader()
                reader.readAsDataURL(input.files[0])
                reader.onload = () => img.setAttribute("src", String(reader.result || "#"))
                formImage.classList.add("_active")
                input.setAttribute("data-modified", String(1))
            }
        })

        popupEdit.addEventListener("click", (e: MouseEvent): void => {
            const target = e.target as HTMLElement
            if (target.closest(".form-image__delete")) {
                e.preventDefault()
                const formImage = target.closest<HTMLElement>(".form-image")
                if (!formImage) return alert('.form-image does not exist')

                const input = formImage.querySelector<HTMLInputElement>(".form-image__input")
                if (!input) return alert('.form-image__input does not exist')

                const img = formImage.querySelector<HTMLImageElement>(".form-image__img")
                if (!img) return alert('.form-image__img does not exist')

                img.setAttribute("src", "#")
                formImage.classList.remove("_active")
                input.setAttribute("data-modified", String(1))
                input.value = ""
            }
        })
    }
})()