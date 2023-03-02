/* step 1 - match accidents to roads */

set search_path to roadsafety, public;

drop table if exists t1;
create table t1 (
id serial primary key,
old_id text,
geom geometry);

insert into t1 (old_id, geom)
select id, (st_dump(r.geom)).geom as geom
from roads as r;

delete from t1  where st_srid(geom)=0;

select * from t1 limit 5;

create index t1_idx on t1 using gist(geom);
create index acci_idx on accidents using gist(geom)

drop table if exists accidents_and_roads;
create table accidents_and_roads as (
select distinct on (a.id) a.id, r.id as roadid, r.old_id, st_distance (a.geom, r.geom)
from accidents as a, t1 as r
where a.id < 201
/* NOTE: this where clause puts 200 records into the table */
/* but table will not exist if where clause is removed */
/* need to fix */
order by a.id, st_distance(a.geom, r.geom) asc);


/* step 2 - calculate road length */

drop table if exists road_length;
create table road_length AS
	SELECT id, old_id, st_length(geom) as length
	from t1;

select * from road_length limit 20;

/* step 3 - join accidents_and_roads to road_length */
/* use roadid to easily destinguish roads from each other*/

SELECT a.roadid, l.length, COUNT(*)
FROM accidents_and_roads as a
JOIN road_length as l ON a.old_id = l.old_id
GROUP BY a.roadid, l.length
ORDER BY count desc;