// fuc print pdf 
const sub_reportnote = async () => {
    if (JSON.parse(localStorage.getItem('report')).length > 0) {
        Alert.showConfirmWarning(`* รายการจะพิมพ์ตามตารางที่แสดงในหน้านี้`, async (result) => {
            if (result) {
                try {
                    let data = JSON.parse(localStorage.getItem('report'));
                    let res = await fetchBlob('/report/pdf', {
                        action: 'reportnote',
                        data,
                        com_id: JSON.parse(localStorage.getItem('token'))
                    });

                    if (res) {
                        let url = URL.createObjectURL(res)
                        window.open(url)
                        modals.close()
                    }

                } catch (error) {
                    console.error(error);
                    Alert.showConfirmError(`ไม่สามารถเปิด PDF ได้ \n ${error}`)
                }
            }
        })
    } else {
        Alert.showConfirmError('ไม่มีรายการที่จะพิมพ์')
        modals.close()
    }
}

const sub_reporttime = async () => {
    if (JSON.parse(localStorage.getItem('report')).length > 0) {
        Alert.showConfirmWarning(`* รายการจะพิมพ์ตามตารางที่แสดงในหน้านี้`, async (result) => {
            if (result) {
                try {
                    let data = JSON.parse(localStorage.getItem('report'));
                    let res = await fetchBlob('/report/pdf', {
                        action: 'reporttime',
                        data,
                        com_id: JSON.parse(localStorage.getItem('token'))
                    });

                    if (res) {
                        let url = URL.createObjectURL(res)
                        window.open(url)
                        modals.close()
                    }
                } catch (error) {
                    console.error(error);
                    Alert.showConfirmError(`ไม่สามารถเปิด PDF ได้ \n ${error}`)
                }
            }
        })
    } else {
        Alert.showConfirmError('ไม่มีรายการที่จะพิมพ์')
    }
}

const sub_reportyear = async () => {
    if (JSON.parse(localStorage.getItem('report')).length > 0) {
        Alert.showConfirmWarning(`* รายการจะพิมพ์ตามตารางที่แสดงในหน้านี้`, async (result) => {
            if (result) {
                try {
                    let data = JSON.parse(localStorage.getItem('report'));
                    let res = await fetchBlob('/report/pdf', {
                        action: 'reportyear',
                        data,
                        com_id: JSON.parse(localStorage.getItem('token'))
                    });

                    if (res) {
                        let url = URL.createObjectURL(res)
                        window.open(url)
                        modals.close()
                    }
                } catch (error) {
                    console.error(error);
                    Alert.showConfirmError(`ไม่สามารถเปิด PDF ได้ \n ${error}`)
                }
            }
        })
    } else {
        Alert.showConfirmError('ไม่มีรายการที่จะพิมพ์')
        modals.close()
    }
}

