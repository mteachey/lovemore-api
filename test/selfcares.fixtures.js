function makeSelfCaresArray(){
    return[
         {
            "id":1,
            "user_id":1,
            "content":"Did 15 minutes of Duolingo",
            "type":"intellectual",
            "rating":5,
            "date_modified":"2029-01-22T16:28:32.615Z"           
        },
        {
            "id":2,
            "user_id":1,
            "content":"Sat in the park and read a book",
            "type":"emotional",
            "rating":5,
            "date_modified":"2029-01-22T16:28:32.615Z"           
        },
        {
            "id":3,
            "user_id":1,
            "content":"Filled out my daily gratitude",
            "type":"spiritual",
            "rating":2,
            "date_modified":"2029-01-22T16:28:32.615Z"           
        },
        {
            "id":4,
            "user_id":1,
            "content":"Went for a run",
            "type":"physical",
            "rating":5,
            "date_modified":"2029-01-22T16:28:32.615Z"           
        },
        {
            "id":5,
            "user_id":2,
            "content":"Had a small social gathering with two amazing ladies",
            "type":"emotional",
            "rating":5,
            "date_modified":"2029-01-22T16:28:32.615Z"           
        }

    ]
}

function makeMaliciousSelfCare(){
    const maliciousSelfCare={
        id:911,
        user_id:1,
        type:"emotional",
        rating:5,
        date_modified:new Date().toISOString(),
        content:`Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedSelfCare={
        ...maliciousSelfCare,
        content:`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`

    }
    return {maliciousSelfCare, expectedSelfCare}
}

module.exports ={
    makeSelfCaresArray,
    makeMaliciousSelfCare
}