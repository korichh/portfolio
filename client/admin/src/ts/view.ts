(function () {
    const menuItems = document.querySelectorAll<HTMLElement>(".menu-item")

    if (menuItems.length) {
        if (window.location.search === "") Array.from(menuItems).find(item => item.querySelector("a")?.getAttribute("href")?.includes("?dashboard"))?.classList.add("current-menu-item")
        else {
            menuItems.forEach((item: HTMLElement): void => {
                const href = item.querySelector("a")?.getAttribute("href")
                if (href && window.location.search === href) item.classList.add("current-menu-item")
            })
        }
    }
})()