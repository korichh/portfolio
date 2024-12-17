function parseInputArray(formData: FormData): void {
    const names = [...formData].reduce<Record<string, (FormDataEntryValue | [string, FormDataEntryValue])[]>>((acc, [key, value]) => {
        const match = key.match(/(.+?)\[(.*?)\]/)
        if (match) {
            const [, name, id] = match
            if (!acc[name]) acc[name] = []
            if (id !== "") acc[name].push([id, value])
            else if (id === "" && value !== "") acc[name].push(value)
            formData.delete(key)
        }
        return acc
    }, {})

    Object.entries(names).forEach(([name, value]) => formData.append(name, JSON.stringify(value)))
}

function escapeHTML(html: string): string {
    return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

async function entitiesListHtml(entity_type_name: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("entity_type_name", entity_type_name)
        formData.append("query", JSON.stringify(Object.fromEntries(new URLSearchParams(window.location.search))))

        const response = await fetch("/api/entity/?list_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.list_html = data.list_html.trim()

            if (data.list_html) return data.list_html
            else throw new Error("Entities list is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function entityItemHtml(entity_type_name: string, entity_id: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("entity_type_name", entity_type_name)
        formData.append("entity_id", entity_id)

        const response = await fetch("/api/entity/?item_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.item_html = data.item_html.trim()

            if (data.item_html) return data.item_html
            else throw new Error("Entity item does not exist")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function updateEntitiesList(entity_type_name: string): Promise<void> {
    try {
        const loader = document.querySelector<HTMLElement>(".loader")
        loader?.classList.add("_active")

        const entitiesList = await entitiesListHtml(entity_type_name)

        setTimeout(() => {
            const entitiesContainer = document.querySelector<HTMLElement>(".entities-container")
            if (!entitiesContainer) throw new Error(".entities-container does not exist")

            window.scrollTo({ top: 0, behavior: "smooth" })
            entitiesContainer.innerHTML = entitiesList || ""
            loader?.classList.remove("_active")
        }, 300)
    } catch (e: any) {
        alert(e.message)
    }
}

function updateQueryFilters(event: Event, form: HTMLFormElement, entity_type_name: string): void {
    event.preventDefault()

    const formData = new FormData(form)
    parseInputArray(formData)

    const query = new URLSearchParams(window.location.search)
    for (const [key, value] of [...formData]) query.set(key, String(value))

    const url = `${window.location.pathname}?${query.toString()}`

    window.history.replaceState("", "", url)

    updateEntitiesList(entity_type_name)
}

function updateQueryPage(event: Event, container: HTMLElement, entity_type_name: string): void {
    const target = event.target as HTMLElement
    if (target.closest(".pagination__elem")) {
        event.preventDefault()

        const href = target.closest<HTMLElement>(".pagination__elem")?.getAttribute("href")
        if (!href) return alert(".pagination__elem href does not exist")

        const match = href.match(/(?<=page=)(.+)/)
        if (!match) return alert("incorrect href in .pagination__elem")

        const page = match[1]
        const query = new URLSearchParams(window.location.search)
        query.set("page", page)

        const url = `${window.location.pathname}?${query.toString()}`

        window.history.replaceState("", "", url)

        updateEntitiesList(entity_type_name)
    }
}

async function getProject(event: Event, project_id: string): Promise<void> {
    event.preventDefault()
    try {
        const popupProject = document.querySelector<HTMLElement>(".popup__project")
        if (!popupProject) throw new Error(".popup__project does not exist")

        const projectItem = await entityItemHtml("project", project_id)
        popupProject.innerHTML = projectItem || ""

        const query = new URLSearchParams(window.location.search)
        query.set("project", String(project_id))

        const url = `${window.location.pathname}?${query.toString()}`

        window.history.replaceState("", "", url)
    } catch (e: any) {
        alert(e.message)
    }
}

function copyLink(event: Event, link: HTMLElement, message: string): void {
    event.preventDefault()

    const linkSpan = link.querySelector<HTMLElement>("span")
    if (!linkSpan) return alert("link span does not exist")

    const linkText = linkSpan.textContent
    link.style.cssText = "pointer-events:none;"
    linkSpan.textContent = message

    const textarea = document.createElement("textarea")
    textarea.style.cssText = "position:absolute;width:0;height:0;"
    textarea.value = window.location.href
    document.body.append(textarea)
    textarea.select()
    document.execCommand("copy")
    textarea.remove()

    setTimeout(() => {
        link.style.cssText = ""
        linkSpan.textContent = linkText
    }, 2000)
}

async function sendMessage(event: Event, form: HTMLFormElement, success: string): Promise<void> {
    event.preventDefault()
    try {
        const loader = document.querySelector<HTMLElement>(".loader")
        loader?.classList.add("_active")

        const formData = new FormData(form)

        const response = await fetch("/api/contact/?send_message", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        setTimeout(() => {
            loader?.classList.remove("_active")
            if (response.ok) {
                form.textContent = success || data.message
            } else {
                alert(data.message)
            }
        }, 300)
    } catch (e: any) {
        alert(e.message)
    }
}