alter table roadsafety.accidents add column geom geometry (point, 4326);

-- column name geom, type geometry and 4326 is the SRID code

update roadsafety.accidents set geom = st_setsrid(st_makepoint(longitude,latitude),4326);

-- re-project from longitude & latitude into OSGB grid coordinates (below)
alter table roadsafety.accidents
alter column geom type geometry(point, 27700)
using st_transform(geom,27700);
