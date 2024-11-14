const pageAction = {
    pageSelctor: (target) => {
        let contai_page = document.querySelectorAll('.page')
        contai_page.forEach((page) => {
            page.style.display = 'none'

            if (target === page.getAttribute('page')) {
                page.style.display = 'flex'
            }
        })
    }
}

let myChart;
let myChartType;
let color;
const PageElement = {
    box_coust: async () => {
        let data1 = []
        let data2 = []
        try {
            const res = await fetchAPI('/data/datareport', { action: 'index', company: localStorage.getItem('token') })
            const res2 = await fetchAPI('/data/datareport', { action: 'indexcoust', company: localStorage.getItem('token') })
            data1 = res.data
            data2 = res2.data

            if (data1.length > 0) {
                data1.forEach(item => {
                    document.getElementById('box_income').innerHTML = item.total_income?.toLocaleString() || '0'
                    document.getElementById('box_expense').innerHTML = item.total_expense?.toLocaleString() || '0'
                    document.getElementById('box_balance').innerHTML = item.total_balance?.toLocaleString() || '0'
                })
            } else {
                document.getElementById('box_income').innerHTML = '0'
                document.getElementById('box_expense').innerHTML = '0'
                document.getElementById('box_balance').innerHTML = '0'
            }

            if (data2.length > 0) {
                data2.forEach(item => {
                    document.getElementById('box_total').innerHTML = item.total_balance?.toLocaleString() || '0'
                })
            } else {
                document.getElementById('box_total').innerHTML = '0'
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    },
    select_accout: async () => {
        let data = []
        try {
            const res = await fetchAPI('/data/company', { action: 'all' })
            data = res.data

            let html = '<option value="null">ไม่พบบัญชี</option>'
            let select_account = document.getElementById('account_user')
            let com_id = localStorage.getItem('token')

            if (res.message === 'ok' && data.length > 0) {
                if (com_id === 'null') { localStorage.setItem('token', JSON.stringify(res.data[0].com_id)) }
                html = data
                    .map(item => {
                        return `<option value="${item.com_id}">${item.com_name}</option>`
                    }).join('');
            } else {
                html = '<option value="null">ไม่พบบัญชี</option>'
                localStorage.setItem('token', 'null')
            }

            select_account.innerHTML = html
            let option = document.querySelector(`option[value="${com_id}"]`)
            if (option) {
                option.selected = true
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            return
        }
    },
    select_typelist: (target, add) => {
        let html = ''
        let data = JSON.parse(localStorage.getItem('selecttype')) || []

        let select_typelist = document.querySelectorAll('.selecttype')

        if (target > 0) {
            if (add) {
                html = `<option value="0" selected>ทุกประเภท</option>`
            }

            html = data
                .filter(item => item.typenote_id == target)
                .map(item => {
                    return `<option value="${item.type_id}">${item.type_name}</option>`
                })
                .join('');
            select_typelist.forEach(item => {
                item.style.display = 'block'
                item.innerHTML = html
            })
            return
        } else {
            select_typelist.forEach(item => {
                item.style.display = 'none'
            })
            return
        }
    },
    table_type: async (target = 1) => {
        let element
        let data = JSON.parse(localStorage.getItem('selecttype'))

        if (data.length === 0) {
            element = ''
        }

        if (target > 0) {
            element = data
                .filter(item => item.typenote_id == target)
                .map((item, i) => {
                    return (
                        `<table class="body-table" width="100%">
                            <tr>
                                <td width="10%">${i + 1}</td>
                                <td>${item.type_name}</td>
                                <td width="10%">
                                    <button class="btn bg-y" action="editenote" onclick="modals.AddPopupEditType(${item.type_id})">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                            width="20px" fill="#ffffff">
                                            <path
                                            d="M192-144v-153l498-498q11-11 24-16t27-5q14 0 27 5t24 16l51 51q11 11 16 24t5 27q0 14-5 27t-16 24L345-144H192Zm72-72h51l380-380-25-26-26-25-380 380v51Zm539-491-51-51 51 51Zm-133 85-26-25 51 51-25-26ZM564-144q61 0 120.5-35.5T744-276q0-34-15.5-56.5T679-376l-54 53q25 13 36 22.5t11 24.5q0 23-35.5 41.5T564-216q-14 0-25 11t-11 25q0 15 11 25.5t25 10.5ZM216-423l56-56q-21-5-38.5-16T216-516q0-10 17.5-22.5T301-576q79-40 105-68.5t26-63.5q0-51-37.5-79.5T298-816q-41 0-78 13.5T166-767q-9 12-8 26.5t13 23.5q11 9 26.5 7.5T222-721q13-13 33-18t43-5q31 0 46.5 10.5T360-708q0 13-16.5 26.5T269-640q-70 34-97.5 61T144-516q0 29 17.5 53t54.5 40Z" />
                                        </svg>
                                </button>
                            </td>
                        </tr>
                    </table>`
                    )
                }).join('')
        } else {
            element = ''
        }
        let tbody = document.getElementById('table_type')
        tbody.innerHTML = element
    },
    chart_main: async (value = 'day') => {
        let res = []

        try {
            res = await fetchAPI('/data/datareport', { action: value, company: localStorage.getItem('token') })
        } catch (error) {
            console.error('Error fetching data:', error);
            return
        }

        let labels = []
        let income = []
        let expenses = []

        res.data.forEach((item) => {
            if (value === 'day') {
                const date = new Date(item.detail_date).toLocaleDateString('th-TH')
                labels.push(date)
            }

            if (value === 'month') {
                let months = [
                    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม',
                    'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม',
                    'พฤศจิกายน', 'ธันวาคม'
                ];

                if (item.month) {
                    labels.push(months[parseInt(item.month.split('-')[0]) - 1]);
                } else {
                    console.warn('เดือนไม่ถูกต้อง');
                }
            }

            if (value === 'year') {
                labels.push(item.year)
            }

            income.push(item.total_income)
            expenses.push(item.total_expense)
        })

        color = localStorage.getItem('theme') === 'light' ? '#22252A' : '#fff'

        let ctx = document.getElementById('myChart')?.getContext('2d');
        if (!ctx) return

        if (myChart) {
            myChart.destroy()
        }

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'รายรับ',
                        data: income,
                        backgroundColor: '#38bdf8',
                        borderColor: '#38bdf8',
                        borderWidth: 1
                    },
                    {
                        label: 'รายจ่าย',
                        data: expenses,
                        backgroundColor: '#f87171',
                        borderColor: '#f87171',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: color
                        }
                    },
                    title: {
                        display: true,
                        text: 'Custom Chart Title',
                        color: color
                    }
                },
                scales: {
                    x: {
                        barThickness: 5,
                        maxBarThickness: 5,
                        ticks: {
                            color: color
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: color
                        }
                    }
                },
                barThickness: 50,
            }
        });
    },
    chart_type: async (target = 'day') => {

        color = localStorage.getItem('theme') === 'light' ? '#22252A' : '#fff'
        let ctx = document.getElementById('myChartType')?.getContext('2d');
        if (!ctx) return

        if (myChartType) {
            myChartType.destroy()
        }

        myChartType = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                    {
                        label: 'เงินรายรับ',
                        data: [12, 19, 8, 5, 2, 3],
                        borderWidth: 3
                    },
                    {
                        label: 'เงินรายจ่าย',
                        data: [29, 45, 5, 7, 8, 1],
                        borderWidth: 3
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: color
                        }
                    },
                    title: {
                        display: true,
                        text: 'Custom Chart Title',
                        color: color
                    }
                },
                scales: {
                    x: {
                        barThickness: 5,
                        maxBarThickness: 5,
                        ticks: {
                            color: color
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: color
                        }
                    }
                },
                barThickness: 50,
            }
        });
    },
    table_note: async (target) => {
        let data = []

        if (target === 'filter') {
            data = JSON.parse(localStorage.getItem('detailslist'))
        } else if (target === 'datalog') {
            data = JSON.parse(localStorage.getItem('detailslistlog'))
        } else {
            try {
                const res = await fetchAPI('/data/details', { action: 'all', company: localStorage.getItem('token') })
                localStorage.setItem('detailslist', JSON.stringify(res.data))
                data = res.data
            } catch (error) {
                console.error('Error fetching data:', error);
                return
            }
        }

        let tbody = document.querySelector('.table-body');
        if (!tbody) return

        let element = data.map((value, i) => {
            const date = new Date(value.detail_date).toLocaleDateString('th-TH')
            return (
                `<table class="body-table" width="100%">
                    <tr>
                        <th width="5%" class="index">${i + 1}</th>
                        <th width="15%">${date}</th>
                        <th width="15%">${value.type_name}</th>
                        <th width="10%">${value.typenote_id === 1 ? 'รายรับ' : 'รายจ่าย'}</th>
                        <th class="index">${value.detail_note}</th>
                        <th width="20%">${value.detail_coust.toLocaleString()}</th>
                        <th width="10%">
                            <button class="btn bg-ye" name="editnote" id="${value.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                    width="20px" fill="#ffffff">
                                    <path
                                        d="M192-144v-153l498-498q11-11 24-16t27-5q14 0 27 5t24 16l51 51q11 11 16 24t5 27q0 14-5 27t-16 24L345-144H192Zm72-72h51l380-380-25-26-26-25-380 380v51Zm539-491-51-51 51 51Zm-133 85-26-25 51 51-25-26ZM564-144q61 0 120.5-35.5T744-276q0-34-15.5-56.5T679-376l-54 53q25 13 36 22.5t11 24.5q0 23-35.5 41.5T564-216q-14 0-25 11t-11 25q0 15 11 25.5t25 10.5ZM216-423l56-56q-21-5-38.5-16T216-516q0-10 17.5-22.5T301-576q79-40 105-68.5t26-63.5q0-51-37.5-79.5T298-816q-41 0-78 13.5T166-767q-9 12-8 26.5t13 23.5q11 9 26.5 7.5T222-721q13-13 33-18t43-5q31 0 46.5 10.5T360-708q0 13-16.5 26.5T269-640q-70 34-97.5 61T144-516q0 29 17.5 53t54.5 40Z" />
                                </svg>
                                แก้ไข
                            </button>
                        </th>
                    </tr>
                </table>`
            );
        }).join('');

        tbody.innerHTML = element;
        PageElement.addmodalEvent()
        localStorage.setItem('report', JSON.stringify(data))
    },
    table_notetime: async (target) => {
        let data = []

        if (target === 'filter') {
            data = JSON.parse(localStorage.getItem('detailslist'))
        } else if (target === 'datalog') {
            data = JSON.parse(localStorage.getItem('detailslistlog'))
        } else {
            try {
                const res = await fetchAPI('/data/datareport', { action: 'month', company: localStorage.getItem('token') })
                localStorage.setItem('detailslist', JSON.stringify(res.data))
                data = res.data
            } catch (error) {
                console.error('Error fetching data:', error);
                return
            }
        }

        let tbody = document.querySelector('#table_notetime');
        if (!tbody) return

        let months = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม',
            'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม',
            'พฤศจิกายน', 'ธันวาคม'
        ];

        let element = data.map((value, i) => {
            if (!value.month) {
                console.warn('Missing month value');
                return '';
            }

            let monthParts = value.month.split('-');
            if (monthParts.length !== 2) {
                console.warn(`Invalid month format: ${value.month}`);
                return '';
            }

            let month = parseInt(monthParts[0]) - 1;
            if (month < 0 || month > 11) {
                console.warn(`Invalid month index: ${month}`);
                return '';
            }

            return (
                `<table class="body-table" width="100%">
                    <tr>
                        <th width="5%">${i + 1}</th>
                        <td width="15%">${months[month] + " " + monthParts[1]}</td>
                        <td width="15%">${value.type_name}</td>
                        <td width="20%">${value.type_note === 1 ? 'รายรับ' : 'รายจ่าย'}</td>
                        <td width="20%">${value.total_income === 0 ? '-' : value.total_income.toLocaleString()}</td>
                        <td width="20%">${value.total_expense === 0 ? '-' : value.total_expense.toLocaleString()}</td>
                    </tr>
                </table>`
            );
        }).join('');

        tbody.innerHTML = element;
        localStorage.setItem('report', JSON.stringify(data))
    },
    table_noteyear: async (target) => {
        let data = []

        if (target === 'filter') {
            data = JSON.parse(localStorage.getItem('detailslist'))
        } else if (target === 'datalog') {
            data = JSON.parse(localStorage.getItem('detailslistlog'))
        } else {
            try {
                const res = await fetchAPI('/data/datareport', { action: 'year', company: localStorage.getItem('token') })
                localStorage.setItem('detailslist', JSON.stringify(res.data))
                data = res.data
            } catch (error) {
                console.error('Error fetching data:', error);
                return
            }
        }

        let tbody = document.querySelector('#table_noteyear');
        if (!tbody) return

        let element = data.map((value, i) => {
            return (
                `<table class="body-table" width="100%">
                    <tr>
                        <th width="10%">${i + 1}</th>
                        <th width="20%">${value.year}</th>
                        <th width="20%">${value.total_income === 0 ? '-' : value.total_income.toLocaleString()}</th>
                        <th width="20%">${value.total_expense === 0 ? '-' : value.total_expense.toLocaleString()}</th>
                        <th width="30%">${(value.total_income - value.total_expense).toLocaleString()}</th>
                    </tr>
                </table>`
            );
        }).join('');

        tbody.innerHTML = element;
        localStorage.setItem('report', JSON.stringify(data))
    },
    table_company: async (target) => {
        let data = []

        if (target === 'filter') {
            data = JSON.parse(localStorage.getItem('detailslist'))
        } else if (target === 'datalog') {
            data = JSON.parse(localStorage.getItem('detailslistlog'))
        } else {
            try {
                const res = await fetchAPI('/data/company', { action: 'all', company: localStorage.getItem('token') })
                localStorage.setItem('detailslist', JSON.stringify(res.data))
                data = res.data
            } catch (error) {
                console.error('Error fetching data:', error);
                return
            }
        }

        let tbody = document.querySelector('#table_company');
        if (!tbody) return

        let element = data.map((value, i) => {
            return (
                `<table class="body-table" width="100%">
                    <tr>
                        <th width="10%">${i + 1}</th>
                        <th width="25%">${value.com_name}</th>
                        <th width="55%">${value.com_details === null ? 'ไม่มี' : value.com_details}</th>
                        <th width="10%">
                            <button class="btn bg-y" name="editcompany" id="${value.com_id}">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                    width="20px" fill="#ffffff">
                                    <path
                                        d="M192-144v-153l498-498q11-11 24-16t27-5q14 0 27 5t24 16l51 51q11 11 16 24t5 27q0 14-5 27t-16 24L345-144H192Zm72-72h51l380-380-25-26-26-25-380 380v51Zm539-491-51-51 51 51Zm-133 85-26-25 51 51-25-26ZM564-144q61 0 120.5-35.5T744-276q0-34-15.5-56.5T679-376l-54 53q25 13 36 22.5t11 24.5q0 23-35.5 41.5T564-216q-14 0-25 11t-11 25q0 15 11 25.5t25 10.5ZM216-423l56-56q-21-5-38.5-16T216-516q0-10 17.5-22.5T301-576q79-40 105-68.5t26-63.5q0-51-37.5-79.5T298-816q-41 0-78 13.5T166-767q-9 12-8 26.5t13 23.5q11 9 26.5 7.5T222-721q13-13 33-18t43-5q31 0 46.5 10.5T360-708q0 13-16.5 26.5T269-640q-70 34-97.5 61T144-516q0 29 17.5 53t54.5 40Z" />
                                </svg>
                                แก้ไข
                            </button>
                        </th>
                    </tr>
                </table>`
            );
        }).join('');

        tbody.innerHTML = element;
        PageElement.addmodalEvent()
        PageElement.select_accout()
        localStorage.setItem('report', JSON.stringify(data))
    },
    addmodalEvent: () => {
        let date = new Date().toISOString().split('T')[0]
        document.getElementById('dateInput').value = date

        let btn = document.querySelectorAll('.btn')
        btn.forEach(item => {
            if (item.getAttribute('name') === 'close-modal') {
                item.addEventListener('click', () => {
                    modals.close()
                })
            } else {
                item.addEventListener('click', (e) => {
                    modals.open(e.currentTarget.name)
                    PageElement.modalEditDetails(e.currentTarget.id)
                    PageElement.modalEditCompany(e.currentTarget.id)
                })
            }
        })

        let overlay = document.querySelector('.overlay')
        if (overlay) {
            overlay.addEventListener('click', () => modals.close())
        }
    },
    modalEditDetails: (id) => {
        let data = JSON.parse(localStorage.getItem('detailslist'))
        let form = document.querySelector('#subeditnote')
        if (!form) return

        let html = data
            .filter(item => item.id == id)
            .map(item => {
                let date = new Date(item.detail_date).toISOString().split('T')[0];
                return `
                <input type="date" name="detail_date" value="${date}" required>
                <input type="hidden" name="id" value="${id}">
                <div class="select-box">
                    <select name="type_note" value="${item.type_note}" class="selecttypenote">
                        <option value="1" id="income" ${item.type_note == 1 ? 'selected' : ''}>รายรับ</option>
                        <option value="2" id="expenses" ${item.type_note == 2 ? 'selected' : ''}>รายจ่าย</option>
                    </select>
                </div>
                <div class="select-box">
                    <select name="type_id" class="selecttype" value="${item.type_id}" >
                        <option value="${item.type_id}" selected>${item.type_name}</option>
                    </select>
                </div>
                <textarea name="detail_note" rows="4" cols="50" placeholder="${item.detail_note}">${item.detail_note}</textarea>
                <input type="number" name="detail_coust" value="${item.detail_coust}" placeholder="จำนวนเงิน">
                `
            }).join('')

        form.innerHTML = html
    },
    modalEditCompany: (id) => {
        let data = JSON.parse(localStorage.getItem('detailslist'))
        let form = document.querySelector('#subedit_company')
        if (!form) return

        let html = data
            .filter(item => item.com_id == id)
            .map(item => {
                return `
                <label for="namecom">ชื่อบัญชี *</label>
                <input type="text" name="com_name" placeholder="ชื่อบัญชี" value="${item.com_name}" required>
                <input type="hidden" name="com_id" value="${item.com_id}">
                <label for="detail_com">รายละเอียด</label>
                <input type="text" name="com_details" value="${item.com_details === null ? 'ไม่มี' : item.com_details}" placeholder="รายละเอียด" required>
                `
            }).join('')

        form.innerHTML = html
    },
    modalEditUser: async () => {
        try {
            const res = await fetchAPI('/data/user', { action: 'all' })

            let html = res?.data?.map(item => {
                return `<div class="col-profile">
                            <label for="user_name">ชื่อ *</label>
                            <input type="hidden" name="user_id" id="user_id" value="${item.user_id}" required>
                            <input type="text" name="user_name" id="user_name" value="${item.user_name}" required>
                            <label for="user_address">ที่อยู่</label>
                            <textarea name="user_address" rows="4" cols="50" placeholder="รายละเอียด..">${item.user_address}</textarea>
                        </div>
                        <div class="col-profile">
                            <label for="user_email">E-mail</label>
                            <input type="email" name="user_email" id="user_email" value="${item.user_email}" required>
                            <label for="user_password">รหัสผ่าน</label>
                            <input type="password" name="user_password" id="user_password" placeholder="รหัสผ่าน" required>
                            <label for="user_cpassword">ยืนยันรหัสผ่าน</label>
                            <input type="cpassword" name="user_cpassword" id="user_cpassword" placeholder="ยืนยันรหัสผ่าน" required>
                        </div>
                        <div class="col-profile">
                            <div class="circle" id="imageContainer">
                                <img id="image" src="/upload/${item.user_image}" alt="Uploaded Image">
                            </div>
                            <br>
                            <label for="fileInput">
                                <span class="btn-label bg-peple">เลือกรูปภาพ</span>
                            </label>
                            <input type="file" id="fileInput" accept="image/*">
                        </div>`
            }).join('')

            let form = document.querySelector('.contai-profile')
            if (!form) return
            form.innerHTML = html
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
}

const modals = {
    open: async (target) => {
        try {
            const modal = document.querySelectorAll('.modal')
            const overlay = document.querySelector('.overlay')

            if (!modal || !overlay) return

            overlay.style.display = 'flex'

            modal.forEach(item => {
                if (target === item.getAttribute('name')) {
                    item.style.display = 'flex'
                }
            })
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเปิด Modal:', error)
        }
    },

    close: () => {
        try {
            const modal = document.querySelectorAll('.modal')
            const overlay = document.querySelector('.overlay')
            const forms = document.querySelectorAll('form')

            if (!modal || !overlay) return

            overlay.style.display = 'none'

            modal.forEach(item => {
                item.style.display = 'none'
            })

            PageElement.select_typelist()

            forms.forEach(form => {
                form.reset()
            })
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการปิด Modal:', error)
        }
    },

    AddPopupEditType: (id) => {
        try {
            if (!id) return

            const data = JSON.parse(localStorage.getItem('selecttype'))
            if (!data || !data.length) return

            const typeData = data.find(item => item.type_id === id)
            if (!typeData) return

            const html = `
                <form id="subedittype">
                    <div class="select-box">
                        <select name="typenote_id" class="select">
                            <option value="1" ${typeData.typenote_id === 1 ? 'selected' : ''}>รายรับ</option>
                            <option value="2" ${typeData.typenote_id === 2 ? 'selected' : ''}>รายจ่าย</option>
                        </select>
                    </div>
                    <input type="text" name="type_name" placeholder="ชื่อประเภท" value="${typeData.type_name}" required>
                    <input type="hidden" name="id" value="${typeData.type_id}">
                </form>
            `

            Swal.fire({
                title: 'แก้ไขประเภท',
                html: html,
                customClass: {
                    confirmButton: 'btn bg-success',
                    cancelButton: 'btn bg-r',
                    denyButton: 'btn bg-r'
                },
                confirmButtonText: 'ยืนยัน',
                denyButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก',
                showCancelButton: true,
                showConfirmButton: true,
                showDenyButton: true,
                background: Alert.theme().background,
                color: Alert.theme().color,
                preConfirm: async () => {
                    const form = document.querySelector('#subedittype')
                    if (!form) return
                    await sub_edittypelist(form)
                }
            }).then((result) => {
                if (result.isDenied) {
                    Swal.fire({
                        title: 'ลบข้อมูล',
                        text: 'คุณต้องการลบข้อมูลหรือไม่',
                        icon: 'warning',
                        confirmButtonText: 'ยืนยัน',
                        cancelButtonText: 'ยกเลิก',
                        showCancelButton: true,
                        showConfirmButton: true,
                        backdrop: false,
                        background: Alert.theme().background,
                        color: Alert.theme().color,
                        preConfirm: async () => {
                            await sub_deletetypelist(id)
                        }
                    })
                }
            })
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขประเภท:', error)
            Alert.showError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        }
    }
}

const Alert = {
    theme: () => {
        let theme = localStorage.getItem('theme')
        return {
            background: theme === 'dark' ? '#17191C' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
        }
    },
    showError: (message) => {
        let divAlert = document.querySelectorAll('.alert')
        let texterror = document.getElementById('texterror')

        divAlert.forEach((element) => {
            element.style.opacity = 1
            element.style.transition = 'opacity 0.5s ease-in-out'
            if (element.classList.contains('bg-red')) {
                element.style.display = 'flex'
            }
        })
        texterror.innerHTML = message

        setTimeout(() => {
            divAlert.forEach((element) => {
                element.style.opacity = 0
            })
        }, 5000)

        setTimeout(() => {
            divAlert.forEach((element) => {
                element.style.display = 'none'
            })
        }, 5100)
    },
    showSuccess: (message) => {
        let divAlert = document.querySelectorAll('.alert')
        let textsuccess = document.getElementById('textsuccess')

        divAlert.forEach((element) => {
            element.style.opacity = 1
            element.style.transition = 'opacity 0.5s ease-in-out'
            if (element.classList.contains('bg-green')) {
                element.style.display = 'flex'
            }
        })

        textsuccess.innerHTML = message

        setTimeout(() => {
            divAlert.forEach((element) => {
                element.style.opacity = 0
            })
        }, 5000)

        setTimeout(() => {
            divAlert.forEach((element) => {
                element.style.display = 'none'
            })
        }, 5100)
    },
    showWarning: (message) => {
        let divAlert = document.querySelectorAll('.alert')
        let textwarning = document.getElementById('textwarning')

        divAlert.forEach((element) => {
            if (element.classList.contains('bg-y')) {
                element.style.display = 'flex'
            }
        })

        textwarning.innerHTML = message
    },

    showConfirmWarning: (message, callback) => {
        Swal.fire({
            icon: 'warning',
            title: 'คำเตือน',
            text: message,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            showCancelButton: true,
            showConfirmButton: true,
            background: Alert.theme().background,
            color: Alert.theme().color,
        }).then((result) => {
            if (!result.isConfirmed) {
                modals.close()
                return
            }
            callback(result.isConfirmed)
        })
    },

    showConfirmSuccess: (message, callback) => {
        Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: message,
            confirmButtonText: 'ตกลง',
            showCancelButton: true,
            showConfirmButton: true,
            background: Alert.theme().background,
            color: Alert.theme().color,
        }).then((result) => {
            callback(result.isConfirmed)
        })
    },
    showConfirmError: (message, callback) => {
        Swal.fire({
            icon: 'error',
            title: 'ข้อผิดพลาด',
            text: message,
            confirmButtonText: 'ตกลง',
            showCancelButton: true,
            showConfirmButton: true,
            background: Alert.theme().background,
            color: Alert.theme().color,
        }).then((result) => {
            if (!result.isConfirmed) {
                modals.close()
                return
            }
            callback(result.isConfirmed)
        })
    }
}
