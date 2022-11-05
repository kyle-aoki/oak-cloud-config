use oak;

select * from file;

select * from object;

select object_file.id,
       object_id,
       file_id,
       content,
       version,
       is_committed,
       parent,
       name,
       is_file
from object_file
JOIN file f ON f.id = object_file.file_id
JOIN object o ON o.id = object_file.object_id;
