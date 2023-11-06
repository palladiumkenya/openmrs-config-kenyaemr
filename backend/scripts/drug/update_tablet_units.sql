-- update tablet

update drug set dosage_form = 1513 where dosage_form in (162412, -- chewable tablet
                                                         162771, -- oral tablet
                                                         162475, -- vaginal tablet
                                                         162460, -- sublingual tablet
                                                         162415, -- disintegrating tablet
                                                         162464, -- enteric-coated tablet
                                                         162465 -- sustained-release tablet
                                                        );

-- update capsule

update drug set dosage_form = 1608 where dosage_form in (162769, -- oral capsule
                                                         162409, -- enteric-coated capsule
                                                         162410 -- sustained-release capsule
                                                         );
