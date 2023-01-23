set search_path to roadsafety, public;

drop table if exists accidents;
create table accidents (
	id serial primary key,
	longitude float,
	latitude float,
	lsoa_location text,
	police_force text,
	date date,
	severity text,
	vehicles text,
	casualties text,
	road_type text,
	speed_limit text,
	weather text,
	road_conditions text,
	human_crossing text);

select * from roadsafety.accidents;

-- Create temp table to import 2016 data 

drop table if exists roadsafety.temp1;
create table roadsafety.temp1 (
	c1 text, c2 text, c3 text, c4 text, c5 text,
	c6 float, c7 float, c8 text, c9 text, c10 text,
	c11 text, c12 date, c13 text, c14 text, c15 text,
	c16 text, c17 text, c18 text, c19 text, c20 text,
	c21 text, c22 text, c23 text, c24 text, c25 text,
	c26 text, c27 text, c28 text, c29 text, c30 text, 
	c31 text, c32 text, c33 text, c34 text, c35 text, 
	c36 text);
	
select * from roadsafety.temp1;

-- insert specific 2016 data into accidents table (W = Wales)

insert into roadsafety.accidents
(longitude, latitude, lsoa_location, police_force, date, 
 severity, vehicles, casualties, road_type, speed_limit, 
 weather, road_conditions, human_crossing)
select c6, c7, c36, c8, c12, c9, c10, c11, c20, c21, c29, c31, c26 
from roadsafety.temp1
where c36 like 'W%';

select * from roadsafety.accidents;

-- 2016 data used for testing purposes.
-- all data will be imported eventually.
