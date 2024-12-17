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

function inFileTypes(input: HTMLInputElement): boolean {
    if (!input.files || !input.files[0]) {
        alert("input files does not exist")
        return false
    }

    const accept = input.getAttribute("accept")
    if (!accept) {
        alert("accept attribute does not exist")
        return false
    }

    const types = accept.split(",")
    const ext = `.${input.files[0].name.split(".").pop()}`
    return !types.includes(ext) ? false : true
}

async function adminRegister(event: Event, form: HTMLFormElement): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData(form)

        const response = await fetch("/admin/api/auth?register", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            window.location.href = "?login"
        } else {
            form.reset()
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function adminLogin(event: Event, form: HTMLFormElement): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData(form)

        const response = await fetch("/admin/api/auth?login", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            window.location.href = "/admin"
        } else {
            form.reset()
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function editSettings(event: Event, form: HTMLFormElement): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData(form)
        parseInputArray(formData)

        const response = await fetch("/admin/api/setting?edit", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            alert(data.message)
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function pagesTableHtml(): Promise<string | null> {
    try {
        const response = await fetch("/admin/api/page/?table_html", {
            method: "post",
        })
        const data = await response.json()

        if (response.ok) {
            data.table_html = data.table_html.trim()

            if (data.table_html) return data.table_html
            else throw new Error("Pages table is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function editPageHtml(page_id: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("page_id", page_id)

        const response = await fetch("/admin/api/page/?edit_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.edit_html = data.edit_html.trim()

            if (data.edit_html) return data.edit_html
            else throw new Error("Edit page is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function getPage(event: Event, page_id: string): Promise<void> {
    event.preventDefault()
    try {
        const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
        if (!popupEdit) return alert(".popup__edit does not exist")

        const editHtml = await editPageHtml(page_id)
        popupEdit.innerHTML = editHtml || ""
    } catch (e: any) {
        alert(e.message)
    }
}

async function createPage(event: Event): Promise<void> {
    event.preventDefault()
    try {
        const response = await fetch("/admin/api/page/?create", {
            method: "post",
        })
        const data = await response.json()

        if (response.ok) {
            const pagesTable = document.querySelector<HTMLElement>(".pages-table")
            if (!pagesTable) return alert(".pages-table does not exist")

            const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
            if (!popupEdit) return alert(".popup__edit does not exist")

            const tableHtml = await pagesTableHtml()
            const editHtml = await editPageHtml(data.page_id)

            pagesTable.innerHTML = tableHtml || ""
            popupEdit.innerHTML = editHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function editPage(event: Event, form: HTMLFormElement, page_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData(form)
        formData.append("page_id", page_id)

        const response = await fetch("/admin/api/page/?edit", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const pagesTable = document.querySelector<HTMLElement>(".pages-table")
            if (!pagesTable) return alert(".pages-table does not exist")

            const tableHtml = await pagesTableHtml()

            pagesTable.innerHTML = tableHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function deletePage(event: Event, page_id: string): Promise<void> {
    event.preventDefault()
    event.stopPropagation()
    try {
        if (!confirm(`Delete page with id ${page_id}`)) return

        const formData = new FormData()
        formData.append("page_id", page_id)

        const response = await fetch("/admin/api/page/?delete", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const pagesTable = document.querySelector<HTMLElement>(".pages-table")
            if (!pagesTable) return alert(".pages-table does not exist")

            const tableHtml = await pagesTableHtml()

            pagesTable.innerHTML = tableHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function entityTypesTableHtml(): Promise<string | null> {
    try {
        const response = await fetch("/admin/api/entity-type/?table_html", {
            method: "post",
        })
        const data = await response.json()

        if (response.ok) {
            data.table_html = data.table_html.trim()

            if (data.table_html) return data.table_html
            else throw new Error("Entity types table is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function editEntityTypeHtml(entity_type_id: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)

        const response = await fetch("/admin/api/entity-type/?edit_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.edit_html = data.edit_html.trim()

            if (data.edit_html) return data.edit_html
            else throw new Error("Entity type is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function entityTypeItemsHtml(): Promise<string | null> {
    try {
        const response = await fetch("/admin/api/entity-type/?items_html", {
            method: "post",
        })
        const data = await response.json()

        if (response.ok) {
            return data.items_html.trim()
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function getEntityType(event: Event, entity_type_id: string): Promise<void> {
    event.preventDefault()
    try {
        const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
        if (!popupEdit) return alert(".popup__edit does not exist")

        const editHtml = await editEntityTypeHtml(entity_type_id)
        popupEdit.innerHTML = editHtml || ""
    } catch (e: any) {
        alert(e.message)
    }
}

async function createEntityType(event: Event): Promise<void> {
    event.preventDefault()
    try {
        const response = await fetch("/admin/api/entity-type/?create", {
            method: "post",
        })
        const data = await response.json()

        if (response.ok) {
            const entityTypesTable = document.querySelector<HTMLElement>(".entity-types-table")
            if (!entityTypesTable) return alert(".entity-types-table does not exist")

            const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
            if (!popupEdit) return alert(".popup__edit does not exist")

            const tableHtml = await entityTypesTableHtml()
            const editHtml = await editEntityTypeHtml(data.entity_type_id)

            entityTypesTable.innerHTML = tableHtml || ""
            popupEdit.innerHTML = editHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function editEntityType(event: Event, form: HTMLFormElement, entity_type_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData(form)
        formData.append("entity_type_id", entity_type_id)
        parseInputArray(formData)

        const response = await fetch("/admin/api/entity-type/?edit", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const entityTypesTable = document.querySelector<HTMLElement>(".entity-types-table")
            if (!entityTypesTable) return alert(".entity-types-table does not exist")

            const entityTypeItems = document.querySelector<HTMLElement>(".entity-type-items")
            if (!entityTypeItems) return alert(".entity-type-items does not exist")

            const tableHtml = await entityTypesTableHtml()
            const itemsHTML = await entityTypeItemsHtml()

            entityTypesTable.innerHTML = tableHtml || ""
            entityTypeItems.innerHTML = itemsHTML || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function deleteEntityType(event: Event, entity_type_id: string): Promise<void> {
    event.preventDefault()
    event.stopPropagation()
    try {
        if (!confirm(`Delete entity type with id ${entity_type_id}`)) return

        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)

        const response = await fetch("/admin/api/entity-type/?delete", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const entityTypesTable = document.querySelector<HTMLElement>(".entity-types-table")
            if (!entityTypesTable) return alert(".entity-types-table does not exist")

            const entityTypeItems = document.querySelector<HTMLElement>(".entity-type-items")
            if (!entityTypeItems) return alert(".entity-type-items does not exist")

            const tableHtml = await entityTypesTableHtml()
            const itemsHTML = await entityTypeItemsHtml()

            entityTypesTable.innerHTML = tableHtml || ""
            entityTypeItems.innerHTML = itemsHTML || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

function attributeItemHtml(attribute_id: string): string {
    return `<div class="elems-item"><button onclick="deleteEntityAttribute(event, this, '${attribute_id}')"><i class="icon-close"></i></button><textarea name="attributes[${attribute_id}]"></textarea></div>`
}

async function createEntityAttribute(event: Event, entity_type_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)

        const response = await fetch("/admin/api/attribute/?create", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const entityTypesTable = document.querySelector<HTMLElement>(".entity-types-table")
            if (!entityTypesTable) return alert(".entity-types-table does not exist")

            const attributesList = document.querySelector<HTMLElement>(".attributes-list")
            if (!attributesList) return alert(".attributes-list does not exist")

            const tableHtml = await entityTypesTableHtml()
            const attributeHtml = attributeItemHtml(data.attribute_id)

            entityTypesTable.innerHTML = tableHtml || ""
            attributesList.insertAdjacentHTML("beforeend", attributeHtml)
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function deleteEntityAttribute(event: Event, btn: HTMLButtonElement, attribute_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData()
        formData.append("attribute_id", attribute_id)

        const response = await fetch("/admin/api/attribute/?delete", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const entityTypesTable = document.querySelector<HTMLElement>(".entity-types-table")
            if (!entityTypesTable) return alert(".entity-types-table does not exist")

            const elemsItem = btn.closest<HTMLElement>(".elems-item")
            if (!elemsItem) return alert(".elems-item does not exist")

            const tableHtml = await entityTypesTableHtml()

            entityTypesTable.innerHTML = tableHtml || ""
            elemsItem.remove()
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function entitiesTableHtml(entity_type_id: string, entity_type_name: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)
        formData.append("entity_type_name", entity_type_name)

        const response = await fetch("/admin/api/entity/?table_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.table_html = data.table_html.trim()

            if (data.table_html) return data.table_html
            else throw new Error("Entities table is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function editEntityHtml(entity_type_id: string, entity_type_name: string, entity_id: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)
        formData.append("entity_type_name", entity_type_name)
        formData.append("entity_id", entity_id)

        const response = await fetch("/admin/api/entity/?edit_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.edit_html = data.edit_html.trim()

            if (data.edit_html) return data.edit_html
            else throw new Error("Edit entity is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function getEntity(event: Event, entity_type_id: string, entity_type_name: string, entity_id: string): Promise<void> {
    event.preventDefault()
    try {
        const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
        if (!popupEdit) return alert(".popup__edit does not exist")

        const editHtml = await editEntityHtml(entity_type_id, entity_type_name, entity_id)
        popupEdit.innerHTML = editHtml || ""
    } catch (e: any) {
        alert(e.message)
    }
}

async function createEntity(event: Event, entity_type_id: string, entity_type_name: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)
        formData.append("entity_type_name", entity_type_name)

        const response = await fetch("/admin/api/entity/?create", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const entitiesTable = document.querySelector<HTMLElement>(".entities-table")
            if (!entitiesTable) return alert(".entities-table does not exist")

            const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
            if (!popupEdit) return alert(".popup__edit does not exist")

            const tableHtml = await entitiesTableHtml(entity_type_id, entity_type_name)
            const editHtml = await editEntityHtml(entity_type_id, entity_type_name, data.entity_id)

            entitiesTable.innerHTML = tableHtml || ""
            popupEdit.innerHTML = editHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function editEntity(event: Event, form: HTMLFormElement, entity_type_id: string, entity_type_name: string, entity_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData(form)
        formData.append("entity_type_id", entity_type_id)
        formData.append("entity_type_name", entity_type_name)
        formData.append("entity_id", entity_id)
        formData.append("entity_image_modified", form.entity_image.getAttribute("data-modified"))
        Array.from(form.elements).forEach((el) => {
            const input = el as HTMLInputElement
            if (input.type === "checkbox" && !input.checked) formData.append(input.name, "off")
        })
        parseInputArray(formData)

        const response = await fetch("/admin/api/entity/?edit", {
            method: "post",
            body: formData,
        })
        const data = await response.json()

        if (response.ok) {
            const entitiesTable = document.querySelector<HTMLElement>(".entities-table")
            if (!entitiesTable) return alert(".entities-table does not exist")

            const tableHtml = await entitiesTableHtml(entity_type_id, entity_type_name)

            entitiesTable.innerHTML = tableHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function deleteEntity(event: Event, entity_type_id: string, entity_type_name: string, entity_id: string): Promise<void> {
    event.preventDefault()
    event.stopPropagation()
    try {
        if (!confirm(`Delete ${entity_type_name} with id ${entity_id}`)) return

        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)
        formData.append("entity_type_name", entity_type_name)
        formData.append("entity_id", entity_id)

        const response = await fetch("/admin/api/entity/?delete", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const entitiesTable = document.querySelector<HTMLElement>(".entities-table")
            if (!entitiesTable) return alert(".entities-table does not exist")

            const tableHtml = await entitiesTableHtml(entity_type_id, entity_type_name)

            entitiesTable.innerHTML = tableHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function taxonomiesTableHtml(entity_type_id: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)

        const response = await fetch("/admin/api/taxonomy/?table_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.table_html = data.table_html.trim()

            if (data.table_html) return data.table_html
            else throw new Error("Taxonomies table is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function editTaxonomyHtml(entity_type_id: string, taxonomy_id: string): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)
        formData.append("taxonomy_id", taxonomy_id)

        const response = await fetch("/admin/api/taxonomy/?edit_html", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            data.edit_html = data.edit_html.trim()

            if (data.edit_html) return data.edit_html
            else throw new Error("Edit taxonomy is empty")
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
        return null
    }
}

async function getTaxonomy(event: Event, entity_type_id: string, taxonomy_id: string): Promise<void> {
    event.preventDefault()
    try {
        const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
        if (!popupEdit) return alert(".popup__edit does not exist")

        const editHtml = await editTaxonomyHtml(entity_type_id, taxonomy_id)
        popupEdit.innerHTML = editHtml || ""
    } catch (e: any) {
        alert(e.message)
    }
}

async function createTaxonomy(event: Event, entity_type_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)

        const response = await fetch("/admin/api/taxonomy/?create", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const taxonomiesTable = document.querySelector<HTMLElement>(".taxonomies-table")
            if (!taxonomiesTable) return alert(".taxonomies-table does not exist")

            const popupEdit = document.querySelector<HTMLElement>(".popup__edit")
            if (!popupEdit) return alert(".popup__edit does not exist")

            const tableHtml = await taxonomiesTableHtml(entity_type_id)
            const editHtml = await editTaxonomyHtml(entity_type_id, data.taxonomy_id)

            taxonomiesTable.innerHTML = tableHtml || ""
            popupEdit.innerHTML = editHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function editTaxonomy(event: Event, form: HTMLFormElement, entity_type_id: string, taxonomy_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData(form)
        formData.append("entity_type_id", entity_type_id)
        formData.append("taxonomy_id", taxonomy_id)
        parseInputArray(formData)

        const response = await fetch("/admin/api/taxonomy/?edit", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const taxonomiesTable = document.querySelector<HTMLElement>(".taxonomies-table")
            if (!taxonomiesTable) return alert(".taxonomies-table does not exist")

            const tableHtml = await taxonomiesTableHtml(entity_type_id)

            taxonomiesTable.innerHTML = tableHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function deleteTaxonomy(event: Event, entity_type_id: string, taxonomy_id: string): Promise<void> {
    event.preventDefault()
    event.stopPropagation()
    try {
        if (!confirm(`Delete taxonomy with id ${taxonomy_id}`)) return

        const formData = new FormData()
        formData.append("entity_type_id", entity_type_id)
        formData.append("taxonomy_id", taxonomy_id)

        const response = await fetch("/admin/api/taxonomy/?delete", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const taxonomiesTable = document.querySelector<HTMLElement>(".taxonomies-table")
            if (!taxonomiesTable) return alert(".taxonomies-table does not exist")

            const tableHtml = await taxonomiesTableHtml(entity_type_id)

            taxonomiesTable.innerHTML = tableHtml || ""
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

function taxonomyTermItemHtml(entity_type_id: string, taxonomy_term_id: string): string {
    return `<div class="elems-item"><button onclick="deleteTaxonomyTerm(event, this, '${entity_type_id}', '${taxonomy_term_id}')"><i class="icon-close"></i></button><textarea name="taxonomy_terms[${taxonomy_term_id}]"></textarea></div>`
}

async function createTaxonomyTerm(event: Event, entity_type_id: string, taxonomy_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData()
        formData.append("taxonomy_id", taxonomy_id)

        const response = await fetch("/admin/api/taxonomy-term/?create", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const taxonomiesTable = document.querySelector<HTMLElement>(".taxonomies-table")
            if (!taxonomiesTable) return alert(".taxonomies-table does not exist")

            const taxonomyTermsList = document.querySelector<HTMLElement>(".taxonomy-terms-list")
            if (!taxonomyTermsList) return alert(".taxonomy-terms-list does not exist")

            const tableHtml = await taxonomiesTableHtml(entity_type_id)
            const taxonomyTermHtml = taxonomyTermItemHtml(entity_type_id, data.taxonomy_term_id)

            taxonomiesTable.innerHTML = tableHtml || ""
            taxonomyTermsList.insertAdjacentHTML("beforeend", taxonomyTermHtml)
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function deleteTaxonomyTerm(event: Event, btn: HTMLButtonElement, entity_type_id: string, taxonomy_term_id: string): Promise<void> {
    event.preventDefault()
    try {
        const formData = new FormData()
        formData.append("taxonomy_term_id", taxonomy_term_id)

        const response = await fetch("/admin/api/taxonomy-term/?delete", {
            method: "post",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()

        if (response.ok) {
            const taxonomiesTable = document.querySelector<HTMLElement>(".taxonomies-table")
            if (!taxonomiesTable) return alert(".taxonomies-table does not exist")

            const elemsItem = btn.closest<HTMLElement>(".elems-item")
            if (!elemsItem) return alert(".elems-item does not exist")

            const tableHtml = await taxonomiesTableHtml(entity_type_id)

            taxonomiesTable.innerHTML = tableHtml || ""
            elemsItem.remove()
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}

async function createSitemap(event: Event): Promise<void> {
    event.preventDefault()
    try {
        const response = await fetch("/admin/api/sitemap?create", {
            method: "post"
        })
        const data = await response.json()

        if (response.ok) {
            alert(data.message)
        } else {
            throw new Error(data.message)
        }
    } catch (e: any) {
        alert(e.message)
    }
}