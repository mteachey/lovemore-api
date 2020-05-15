function makeGratitudesArray(){
    return[
        {
            "id":1,
            "user_id":1,
            "content":"I kept my cool with the service phone rep",
            "date_modified":"2029-01-22T16:28:32.615Z"           
        },
        {
            "id":2,
            "user_id":1,
            "content":"A catch up phone call with Kelsie",
            "date_modified":"2029-01-22T16:28:32.615Z"           
        },
        {
            "id":3,
            "user_id":1,
            "content":"Seeing the tulips blooming",
            "date_modified":"2029-01-22T16:28:32.615Z"           
        },
        {
            "id":4,
            "user_id":2,
            "content":"The yummy pizza I had for dinner last night",
            "date_modified":"2029-01-22T16:28:32.615Z"          
        },
    ]
}

function makeMaliciousGratitude(){
    const maliciousGratitude={
        id:911,
        user_id:1,
        date_modified:new Date().toISOString(),
        content:`Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedGratitude={
        ...maliciousGratitude,
        content:`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`

    }
    return {maliciousGratitude, expectedGratitude}
}

module.exports ={
    makeGratitudesArray,
    makeMaliciousGratitude
}