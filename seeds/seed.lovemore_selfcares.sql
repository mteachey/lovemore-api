INSERT INTO lovemore_selfcares (user_id, content, type, rating, date_modified)
VALUES
        (2,'Did 15 minutes of Duolingo','intellectual', 5,now() - '22 days'::INTERVAL),
        (1,'Played chess','intellectual', 4,now() - '21 days'::INTERVAL),
        (1,'Went fishing','emotional',5, now() - '20 days'::INTERVAL),
        (1,'Ate a big juicy steak','spiritual',5, now() - '19 days'::INTERVAL),
        (1,'Carried the wood to built a boat to the house','physical',3,now() - '18 days'::INTERVAL),
        (2,'Filled out my daily gratitude','spiritual',2,now() - '3 days'::INTERVAL),
        (2,'Went for a run','physical',2,now() - '2 days'::INTERVAL),
        (2,'Had a small social gathering with two amazing ladies','emotional',5,now() - '24 days'::INTERVAL),
        (1,'Built a boat','spiritual',5,now() - '17 days'::INTERVAL),
        (2,'Sat in the park and read a book','emotional',5,now() - '25 days'::INTERVAL);
