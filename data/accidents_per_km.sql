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

/*new step 1 - match accidents to roads */
/*made this table instead of fixing accidents_and_roads*/

drop table if exists accidents_road_id;
create table roadsafety.accidents_road_id as(
select distinct on (a.id) a.*,  r.id as roadid
from roadsafety.accidents as a
join roadsafety.t1 as r
on st_dwithin(a.geom, r.geom, 30)
order by a.id, st_distance(a.geom, r.geom) asc);

/*altered created table to add constraints to make queries faster later */
ALTER TABLE roadsafety.accidents_road_id
  ADD CONSTRAINT accident_id_pk 
    PRIMARY KEY (id);

ALTER TABLE roadsafety.accidents_road_id
  ADD CONSTRAINT road_id_fk 
    FOREIGN KEY (roadid) REFERENCES roadsafety.t1 (id);

/* the result is a carbon copy accidents table with the road id (from the t1 table above) attached to each accident, determined by how close they are.  If an accident is more than 30m away from the road, it does not get included in the data set */

/* step 2 - calculate road length */
/* step 2 - does not need to be it's own table, step removed*/
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

/* new step 2 - join accidents_road_id to t1, count and calculate length at the same time */

select a.roadid, count(a.*) as "accident_count", st_length(r.geom)/1000 as "road_length_km", (count(a.*)/(st_length(r.geom)/1000)) as "accidents_per_km", r.geom
from accidents_road_id as a
join t1 as r
on r.id = a.roadid
group by a.roadid, r.geom;