 filename sjfref1 filesrvc "&_webin_fileuri1";
 data _null_;
   file "your/preferred/location";
   infile sjfref1;
   input;
   put _infile_;
  run;
  %put _all_;