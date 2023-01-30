select a.id, a.date, a.severity, a.geom, s.id, s.postcode, s.status, st_buffer(s.geom, 500)
from accidents as a
join secondary_schools as s
on st_dwithin(a.geom, s.geom, 500);
