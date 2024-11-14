// ค้นหา note_search
const handleNoteSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const data = JSON.parse(localStorage.getItem('detailslist')) || []

    const filteredData = searchTerm
        ? data.filter(item => item.detail_note.toLowerCase().includes(searchTerm))
        : data

    localStorage.setItem('detailslistlog', JSON.stringify(filteredData))
    PageElement.table_note(searchTerm ? 'datalog' : 'filter')
}

document.getElementById('searchnote').addEventListener('input', handleNoteSearch)

// เพิ่มรายการ
const sub_addnote = async () => {
    try {
        const form = document.getElementById('subaddnote')
        const formData = new FormData(form)
        const data = {
            action: 'insert',
            detail_date: formData.get('detail_date'),
            type_id: formData.get('type_id'),
            type_note: formData.get('type_note'),
            detail_note: formData.get('detail_note'),
            detail_coust: formData.get('detail_coust'),
            company: localStorage.getItem('token')
        }

        if (!data.detail_date || data.type_note === "0" || !data.detail_coust) {
            Alert.showError('กรุณากรอกข้อมูลให้ครบ')
            return
        }

        const res = await fetchAPI('/data/details', data)

        if (res.message === 'ok') {
            modals.close()
            PageElement.table_note()
            form.reset()
            Alert.showSuccess('บันทึกข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// แก้ไขรายการ
const sub_updatenote = async () => {
    try {
        const form = document.getElementById('subeditnote')
        const formData = new FormData(form)
        const data = {
            action: 'update',
            id: formData.get('id'),
            detail_date: formData.get('detail_date'),
            type_id: formData.get('type_id'),
            type_note: formData.get('type_note'),
            detail_note: formData.get('detail_note'),
            detail_coust: formData.get('detail_coust'),
            company: localStorage.getItem('token')
        }

        if (!data.detail_date || !data.type_note || !data.detail_coust) {
            Alert.showConfirmError('กรุณากรอกข้อมูลให้ครบ', async (result) => {
                if (!result) {
                    return
                }
            })
            return
        }

        const res = await fetchAPI('/data/details', data)

        if (res.message === 'ok') {
            modals.close()
            PageElement.table_note()
            form.reset()
            Alert.showSuccess('แก้ไขข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// ลบรายการ
const sub_deletenote = async () => {
    try {
        const form = document.getElementById('subeditnote')
        const id = new FormData(form).get('id')

        Alert.showConfirmWarning('คุณต้องการลบรายการนี้ไหม', async (result) => {
            if (result) {
                const res = await fetchAPI('/data/details', {
                    action: 'delete',
                    id,
                    company: localStorage.getItem('token')
                })

                if (res.message === 'ok') {
                    modals.close()
                    PageElement.table_note()
                    form.reset()
                    Alert.showSuccess('ลบข้อมูลสำเร็จ')
                }
            }
        })
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// เพิ่มประเภท
const sub_addtypelist = async () => {
    try {
        const form = document.getElementById('subaddtype')
        const formData = new FormData(form)
        const data = {
            action: 'insert',
            type_name: formData.get('type_name'),
            typenote_id: formData.get('typenote_id'),
            company: localStorage.getItem('token')
        }

        if (!data.type_name) {
            Alert.showConfirmError('กรุณากรอกข้อมูลให้ครบ', async (result) => {
                if (!result) {
                    return
                }
            })
            return
        }

        const res = await fetchAPI('/data/typelist', data)

        if (res.message === 'ok') {
            const select = await fetchAPI('/data/typelist', {
                action: 'all',
                company: localStorage.getItem('token')
            })
            localStorage.setItem('selecttype', JSON.stringify(select.data))
            PageElement.select_typelist()
            PageElement.table_type()

            form.reset()
            Alert.showSuccess('บันทึกข้อมูลสำเร็จ')
        } else {
            Alert.showError(res.message)
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

const sub_edittypelist = async (form) => {
    try {
        const formData = new FormData(form)
        const data = {
            action: 'update',
            type_id: formData.get('id'),
            type_name: formData.get('type_name'),
            typenote_id: formData.get('typenote_id'),
            company: localStorage.getItem('token')
        }

        const res = await fetchAPI('/data/typelist', data)
        if (res.message === 'ok') {
            let select = await fetchAPI('/data/typelist', { action: 'all', company: localStorage.getItem('token') })
            localStorage.setItem('selecttype', JSON.stringify(select.data))

            PageElement.table_type(formData.get('typenote_id'))
            PageElement.select_typelist()
            form.reset()
            Alert.showSuccess('แก้ไขข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

const sub_deletetypelist = async (id) => {
    try {
        const res = await fetchAPI('/data/typelist', {
            action: 'delete',
            type_id: id.toString(),
            company: localStorage.getItem('token')
        })

        if (res.message === 'ok') {
            let select = await fetchAPI('/data/typelist', { action: 'all', company: localStorage.getItem('token') })
            localStorage.setItem('selecttype', JSON.stringify(select.data))

            PageElement.table_type(1)
            PageElement.select_typelist()
            Alert.showSuccess('ลบข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)

    }
}

// ค้นหาตามฟิลเตอร์
const sub_searchfilter = async () => {
    try {
        const form = document.querySelector('#formsearchnote')
        const formData = new FormData(form)
        const data = {
            action: 'notefilter',
            date_start: formData.get('date_start'),
            date_end: formData.get('date_end'),
            type_note: formData.get('type_note'),
            type_id: formData.get('type_id'),
            company: localStorage.getItem('token')
        }

        const res = await fetchAPI('/data/details', data)

        if (res) {
            localStorage.setItem('detailslist', JSON.stringify(res.data))
            PageElement.table_note('filter')
            modals.close()
            form.reset()
            Alert.showSuccess('ค้นหาข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// ค้นหาตามเดือน
const sub_monthfilter = async () => {
    try {
        const form = document.querySelector('#formsearchnotetime')
        const formData = new FormData(form)
        const data = {
            action: 'monthfilter',
            date_start: formData.get('date_start'),
            date_end: formData.get('date_end'),
            type_note: formData.get('type_note'),
            type_id: formData.get('type_id'),
            company: localStorage.getItem('token')
        }

        const res = await fetchAPI('/data/details', data)

        if (res.message === 'ok') {
            localStorage.setItem('detailslist', JSON.stringify(res.data))
            PageElement.table_notetime('filter')
            modals.close()
            form.reset()
            Alert.showSuccess('ค้นหาข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// ค้นหาตามปี
const sub_yearfilter = async () => {
    try {
        const form = document.querySelector('#formsearchnoteyear')
        const formData = new FormData(form)
        const data = {
            action: 'yearfilter',
            date_start: formData.get('date_start'),
            date_end: formData.get('date_end'),
            company: localStorage.getItem('token')
        }

        const res = await fetchAPI('/data/details', data)

        if (res.message === 'ok') {
            localStorage.setItem('detailslist', JSON.stringify(res.data))
            PageElement.table_noteyear('filter')
            modals.close()
            form.reset()
            Alert.showSuccess('ค้นหาข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// เพิ่มบริษัท
const sub_addcompany = async () => {
    try {
        const form = document.getElementById('sub_company')
        const formData = new FormData(form)
        const data = {
            action: 'insert',
            com_name: formData.get('com_name'),
            com_details: formData.get('com_details'),
            company: localStorage.getItem('token')
        }

        if (!data.com_name) {
            Alert.showConfirmError('กรุณากรอกข้อมูลให้ครบ', async (result) => {
                if (!result) {
                    return
                }
            })
            return
        }

        const res = await fetchAPI('/data/company', data)

        if (res.message === 'ok') {
            modals.close()
            PageElement.table_company()
            form.reset()
            Alert.showSuccess('บันทึกข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// แก้ไขบริษัท
const sub_editcompany = async () => {
    try {
        const form = document.getElementById('subedit_company')
        const formData = new FormData(form)
        const data = {
            action: 'update',
            com_name: formData.get('com_name'),
            com_details: formData.get('com_details'),
            com_id: formData.get('com_id'),
            company: localStorage.getItem('token')
        }

        if (!data.com_name) {
            Alert.showConfirmError('กรุณากรอกข้อมูลให้ครบ', async (result) => {
                if (!result) {
                    return
                }
            })
            return
        }

        const res = await fetchAPI('/data/company', data)

        if (res.message === 'ok') {
            modals.close()
            PageElement.table_company()
            form.reset()
            Alert.showSuccess('แก้ไขข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// ลบบริษัท
const sub_deletecompany = async () => {
    try {
        const form = document.getElementById('subedit_company')
        const com_id = new FormData(form).get('com_id')

        Alert.showConfirmWarning('คุณต้องการลบรายการนี้ไหม', async (result) => {
            if (result) {
                const res = await fetchAPI('/data/company', {
                    action: 'delete',
                    com_id,
                    company: localStorage.getItem('token')
                })

                if (res.message === 'ok') {
                    modals.close()
                    PageElement.table_company()
                    form.reset()
                    Alert.showSuccess('ลบข้อมูลสำเร็จ')
                } else {
                    Alert.showError(res.message)
                }
            }
        })
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// แก้ไขข้อมูลผู้ใช้
const sub_edituser = async () => {
    try {
        const form = document.getElementById('form_usersetting')
        const formData = new FormData(form)
        const sendData = new FormData()

        sendData.append('action', 'update')
        sendData.append('user_name', formData.get('user_name'))
        sendData.append('user_address', formData.get('user_address'))
        sendData.append('user_email', formData.get('user_email'))
        sendData.append('user_id', formData.get('user_id'))

        if (formData.get('user_name') === '' || formData.get('user_address') === '' || formData.get('user_email') === '' || formData.get('user_password') === '') {
            Alert.showConfirmError('กรุณากรอกข้อมูลให้ครบ', async (result) => {
                if (!result) {
                    return
                }
            })
            return
        }

        const fileInput = document.getElementById('fileInput')
        if (fileInput.files[0]) {
            sendData.append('user_image', fileInput.files[0])
        }

        const password = formData.get('user_password')
        if (password) {
            if (password !== formData.get('user_cpassword')) {
                Alert.showConfirmError('รหัสผ่านไม่ตรงกัน', async (result) => {
                    if (!result) {
                        return
                    }
                })
                return
            }
            sendData.append('user_password', password)
        }

        const res = await fetch('/data/user', {
            method: 'POST',
            body: sendData
        }).then(r => r.json())

        if (res.message === 'ok') {
            modals.close()
            PageElement.modalEditUser()
            form.reset()
            Alert.showSuccess('แก้ไขข้อมูลสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}

// แก้ไขรหัสผ่าน
const sub_editpassword = async () => {
    try {
        const form = document.getElementById('sub_editpassword')
        const formData = new FormData(form)
        const password = formData.get('password')
        const password2 = formData.get('password2')

        if (!password || !password2) {
            Alert.showConfirmError('กรุณากรอกข้อมูลให้ครบ', async (result) => {
                if (!result) {
                    return
                }
            })
            return
        }

        if (password !== password2) {
            Alert.showConfirmError('รหัสผ่านไม่ตรงกัน', async (result) => {
                if (!result) {
                    return
                }
            })
            return
        }

        const res = await fetchAPI('/data/user', {
            action: 'password',
            user_password: password,
            user_id: localStorage.getItem('user_id')
        })

        if (res.message === 'ok') {
            modals.close()
            PageElement.modalEditUser()
            form.reset()
            Alert.showSuccess('แก้ไขรหัสผ่านสำเร็จ')
        }
    } catch (error) {
        Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        console.error(error)
    }
}
