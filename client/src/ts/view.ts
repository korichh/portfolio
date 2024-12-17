(function () {
    const preloader = document.querySelector<HTMLElement>(".preloader")
    const menuItems = document.querySelectorAll<HTMLElement>(".menu-item")
    const popup = document.querySelector<HTMLElement>(".popup")
    const popupProject = document.querySelector<HTMLElement>(".popup__project")

    document.querySelector<HTMLElement>("main img")?.removeAttribute("loading")

    if (preloader) {
        const title = preloader.querySelector<HTMLElement>(".preloader__title")
        const delay = 900
        const titleList = [
            `Code magic happens here`,
            `Let's make it real`,
            `Code solutions, delivered`,
            `Build. Code. Innovate.`,
            `Tailored solutions, fast results`,
            `Your success is my goal`,
            `Create the future online`,
        ]

        if (!title) return alert("preloader__title does not exist")

        let index = Number(localStorage.getItem("title-list-index"))
        if (isNaN(index) || index < 0 || index >= titleList.length) index = 0

        title.textContent = titleList[index]
        localStorage.setItem("title-list-index", String(++index))

        setTimeout(() => {
            preloader.classList.remove("_active")
        }, delay);
    }

    if (menuItems.length) {
        menuItems.forEach((item: HTMLElement): void => {
            const href = item.querySelector("a")?.getAttribute("href")
            if (href && window.location.pathname === href) item.classList.add("_current")
        })
    }

    if (popup && popupProject) {
        const query = new URLSearchParams(window.location.search)
        const project_id = query.get("project")

        if (!project_id || isNaN(Number(project_id))) return

        entityItemHtml("project", project_id).then((item_html: string | null) => {
            if (!item_html || !item_html.trim()) return

            const popupProject = popup.querySelector(".popup__project")
            if (!popupProject) throw new Error(".popup__project does not exist")

            document.body.classList.add("_lock")
            popupProject.classList.add("_active")
            popupProject.innerHTML = item_html
            popup.classList.add("_active")
        }).catch((e: any) => {
            alert(e.message)
        })
    }
})()