import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const out=mkdtempSync(join(tmpdir(),'tnag-dish-cat-'));
try{
 buildSync({entryPoints:['src/lib/dish-categories.ts','src/lib/foods.ts'],outdir:out,bundle:true,platform:'node',format:'cjs'});
 const req=createRequire(import.meta.url);
 const {classifyFood,parsePriceBound,filterAndSortFoods,defaultFilterState}=req(join(out,'dish-categories.js'));
 const {foods}=req(join(out,'foods.js'));

 test('parsePriceBound handles various formats correctly',()=>{
  assert.equal(parsePriceBound(''),null);
  assert.equal(parsePriceBound('50'),50);
  assert.equal(parsePriceBound('50k'),50);
  assert.equal(parsePriceBound('50.000'),50);
  assert.equal(parsePriceBound('50000'),50);
  assert.equal(parsePriceBound('150.000đ'),150);
 });

 test('classifyFood categorizes core dishes correctly',()=>{
  const phoBo=foods.find(f=>f.name==='Phở bò');
  assert.ok(phoBo);
  const phoCat=classifyFood(phoBo);
  assert.equal(phoCat.group,'food');
  assert.equal(phoCat.type,'noodles');

  const comTam=foods.find(f=>f.name==='Cơm tấm');
  assert.ok(comTam);
  const comCat=classifyFood(comTam);
  assert.equal(comCat.group,'food');
  assert.equal(comCat.type,'rice');

  const pizza=foods.find(f=>f.name==='Pizza');
  assert.ok(pizza);
  const pizzaCat=classifyFood(pizza);
  assert.equal(pizzaCat.type,'pizza');
 });

 test('filterAndSortFoods filters and sorts accurately',()=>{
  const noodles=filterAndSortFoods(foods,{...defaultFilterState,type:'noodles'},'vi');
  assert.ok(noodles.length>0);
  assert.ok(noodles.every(f=>['Phở','Bún','Mì','Hủ tiếu','Ramen','Udon','Soba','Miến','Bánh canh','Bánh đa','Pad Thai'].some(k=>f.name.includes(k))));

  const cheap=filterAndSortFoods(foods,{...defaultFilterState,maxPrice:'40'},'vi');
  assert.ok(cheap.length>0);
  assert.ok(cheap.every(f=>f.price<=40));

  const sorted=filterAndSortFoods(foods,{...defaultFilterState,sort:'price-up'},'vi');
  for(let i=1;i<sorted.length;i++){
   assert.ok(sorted[i].price>=sorted[i-1].price);
  }
 });
}finally{rmSync(out,{recursive:true,force:true})}
