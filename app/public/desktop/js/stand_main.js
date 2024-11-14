// แทบเมนู sidebar
const btn_sidebar = document.querySelectorAll('.sidebar-item')
btn_sidebar.forEach(element => {
    element.addEventListener('click', async function (event) {
        let act = document.querySelector('.act')

        if (act) {
            act.classList.remove('act')
        }
        element.classList.add('act')

        let page = event.currentTarget.getAttribute('name')
        pageAction.pageSelctor(page)
        try {
            if (page === 'dash') {
                PageElement.box_coust()
                PageElement.chart_main()
            }

            if (page === 'note') {
                PageElement.table_note()
            }

            if (page === 'report_time') {
                PageElement.table_notetime()
            }

            if (page === 'report_year') {
                PageElement.table_noteyear()
            }

            if (page === 'user_setting') {
                PageElement.table_company()
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error)
            Alert.showError('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง')
        }
    })
})

// การเลือก chart หน้า main
const chartSelect = document.getElementById('chartSelect')
chartSelect?.addEventListener('change', async (e) => {
    const value = e.target.value
    PageElement.chart_main(value)
})

// select เลือกประเภท หากเลือก typenote ให้ type แสดง
const selecttypenote = document.querySelectorAll('.selecttypenote')
selecttypenote.forEach(item => {
    let target = 0
    item.addEventListener('change', async (e) => {
        try {
            target = e.currentTarget.value

            if (target) {
                PageElement.select_typelist(target)
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error)
            Alert.showError('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง')
        }
    })
})

// select เลือกประเภท หากเลือก typenote ให้ type แสดง หน้า boxsearch_note
const select_boxsearch = document.querySelectorAll('.selecttypenotesearch')
select_boxsearch.forEach(element => {
    element.addEventListener('change', async (e) => { // Changed from 'click' to 'change'
        try {
            let target = e.currentTarget.value

            if (target) {
                PageElement.select_typelist(target, 1)
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error)
            Alert.showError('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง')
        }
    })
})

// select เลือกประเภท หน้า modal เพิ่มประเภท
const selecttypenoteModal = document.getElementById('selecttypenoteModal')
selecttypenoteModal?.addEventListener('change', async (e) => {
    let target = e.currentTarget.value
    PageElement.table_type(target)
})

async function loadEelement() {
    try {
        PageElement.chart_main()
        PageElement.addmodalEvent()
        PageElement.modalEditUser()
        PageElement.select_accout()
        PageElement.box_coust()
        PageElement.table_type()


        let account_user = document.getElementById('account_user')
        account_user.addEventListener('change', function (e) { // Changed from 'input' to 'change'
            localStorage.setItem('token', e.target.value)
            if (window.confirm('คุณต้องการเปลี่ยนบัญชีหรือไม่')) {
                location.reload()
            }
        })

        let select = await fetchAPI('/data/typelist', { action: 'all', company: localStorage.getItem('token') });

        if (!select?.data) {
            Alert.showConfirmWarning('กรุณาเพิ่มบัญชีก่อน', async (result) => {
                if (result) {
                    let sidebar = document.querySelectorAll('.sidebar-item')
                    sidebar.forEach(element => {
                        element.classList.remove('act')
                    })
                    document.querySelector('.sidebar-item[name="user_setting"]').classList.add('act')
                    pageAction.pageSelctor('user_setting')
                    PageElement.table_company()
                }
            })
        } else {
            localStorage.setItem('selecttype', JSON.stringify(select.data))
            PageElement.select_typelist(0);
        }

        const fileInput = document.getElementById('fileInput');
        const image = document.getElementById('image');

        fileInput?.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (image) {
                        image.src = e.target.result;
                        image.style.display = 'block';
                    }
                }
                reader.readAsDataURL(file);
            }
        });

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error)
        Alert.showWarning('หากพึ่งเริ่มใช้งาน กรุณาเพิ่มบริษัทก่อน')
    }
}

// load data home index 
window.onload = async () => {
    //toggle theme get data-theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const button = document.getElementById('theme-toggle');
    if (button) {
        button.addEventListener('click', () => {
            PageElement.chart_main()
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    await loadEelement()
}
