select a.id, a.date, a.severity, a.geom, s.id, s.postcode, s.status, st_buffer(s.geom, 500)
from accidents as a
join secondary_schools as s
on st_dwithin(a.geom, s.geom, 500);


/* updated to */

select a.id, a.date, a.severity, a.casualties, a.road_type, a.geom, s.id, s.postcode, s.status, st_buffer(s.geom, 500)
from roadsafety.accidents as a
join roadsafety.secondary_schools as s
on st_dwithin(a.geom, s.geom, 500)
/* exclude dual carrigeways*/
where a.road_type NOT LIKE '3';
