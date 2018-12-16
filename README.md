# BriteCore test task
***
Installation
-----------
1.Download the app\
2.Run `yarn start`\
3.Go to `localhost:4000`

Concept
-----------
The root component, App, is responsible for fetching and sorting data, and handling page change. Three other components - DataTable, InputForm and Pagination, are totally reusable presentational ones.\
\
There is one thing about it. It would be nice to make code more reusable by extracting some big component receiving all the data and managing it's sort and pagination, and leave only fetching for App component. But the problem in that case is that we should or sort and index data each time when this component updates, or check if the data has changed. Both of these operations are potentially expensive for large list (in case of comparison we should perform it deeply). That's why I considered that speed is more important than reusability in this case.\
\
Another thing that in real-world app we probably would use Redux, but it's not needed here.\
\
Talking about design - well, I thought that it's quite simple view to use some advanced techniques as styled-components or with-styles for React, so I just used bootstrap and added some properties by hand.\
\
I've spent about 6 hours for writing all the code.
