import { createClient } from '@libsql/client'

const conection = createClient({
    url: 'libsql://teaching-stilt-man-eduardo355.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTI0VDA1OjM0OjU3Ljk5MTEyMDE2OFoiLCJpZCI6ImYyODc5MDYwLWJhNzgtMTFlZS04ZGQ5LWNlZjM1NjAwNTAyNiJ9.HrmMEVcKpGMekFqMX5SgfkNunPVgBs_EEspvSYgbG3viJUcGiegqs40PykwgU_Kw00KTv-uwhc6dpyhh8f1WDA'
})

export default conection