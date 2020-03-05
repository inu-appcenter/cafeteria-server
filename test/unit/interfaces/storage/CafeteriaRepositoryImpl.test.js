/*
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global Appcenter <potados99@gmail.com>
 *
 * INU Cafeteria is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INU Cafeteria is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
'use strict';

/**
 * Unmock all before applying new mocks.
 */
jest.unmock('@infrastructure/database/sequelize');
jest.unmock('@infrastructure/network/fetch');
jest.unmock('@config/config');
jest.mock('@config/config', () => require('@test/config'));

/**
 * Mock whole usage of sequelize in this repository.
 * Now we don't use DB in out tests.
 */
jest.mock('@infrastructure/database/sequelize', () => {
  return {
    model: jest.fn((name) => {
      switch (name) {
        case 'cafeteria':
          return {
            findAll: jest.fn(() => {
              return [
                {id: 1, name: '이름', image_path: 'path'},
                {id: 2, name: '이름', image_path: 'path'},
                {id: 3, name: '이름', image_path: 'path'},
              ];
            }),

            findByPk: jest.fn((id) => {
              return {id: id, name: '적당한 한글이름', image_path: 'path'};
            }),
          };

        case 'corner':
          return {
            findAll: jest.fn((options) => {
              if (options) {
                return [
                  {id: 1, name: '코너', cafeteria_id: options.where.cafeteria_id},
                  {id: 2, name: '코너', cafeteria_id: options.where.cafeteria_id},
                  {id: 3, name: '코너', cafeteria_id: options.where.cafeteria_id},
                ];
              }
              return [
                {id: 1, name: '코너', cafeteria_id: 1},
                {id: 2, name: '코너', cafeteria_id: 1},
                {id: 3, name: '코너', cafeteria_id: 1},
              ];
            }),

            findByPk: jest.fn((id) => {
              return {id: id, name: '적당한 한글이름', cafeteria_id: 1};
            }),
          };

        case 'menu':
          return {
            findAll: jest.fn(() => {
              return [
                {foods: '밥과 국', price: 3700, calorie: 430, corner_id: 1},
                {foods: '밥과 국', price: 3700, calorie: 430, corner_id: 1},
                {foods: '밥과 국', price: 3700, calorie: 430, corner_id: 1},
              ];
            }),
          };
      }
    }),
  };
});

/**
 * Neither a network.
 */
jest.mock('@infrastructure/network/fetch', () => {
  return {
    getJson: jest.fn(() => {
      return JSON.parse(
          '{"stdDate":"20200219","foodMenuType3Result":[{"TYPE2":"2","FOODMENU_TYPE":"3","STD_DATE":"20200219","MENU":"가자미튀김강정 짜장우동면 두부김치국 비엔나케찹조림 김구이*양념장 케일치커리겉절이 깍두기 흑미밥 5,500원 659kcal ----------- 순대국밥/수육국밥 [부추+양파절임+김치+밥] 5,500원 셀프라면 2,000원","TYPE1":"1"},{"TYPE2":"3","FOODMENU_TYPE":"3","STD_DATE":"20200219","MENU":null,"TYPE1":"1"}],"afterDay":"20200220","foodMenuType5Result":[{"TYPE2":"2","FOODMENU_TYPE":"5","STD_DATE":"20200219","MENU":"스팸*후라이*볶음김치 냉이된장국 순대야채볶음 우엉떡조림 열무나물 참나물유자무침 깍두기/흑미밥5,500원 837Kcal","TYPE1":"1"},{"TYPE2":"3","FOODMENU_TYPE":"5","STD_DATE":"20200219","MENU":"데리야끼장각구이 냉이된장국 미니돈까스*케찹 느타리햄볶음 수제피클 콩나물무침 포기김치/흑미밥5,500원 816Kcal","TYPE1":"1"}],"dayOfWeekString":"수","foodMenuType1Result":[{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":"삼겹살야채볶음알감자조림 도시락김 속배추된장국 쌀밥3500원 759kcal","TYPE1":"1"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":"차돌순두부찌개동그랑땡 청경채나물 무말랭이무침 쌀밥3500원 747kcal","TYPE1":"2"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":"치즈돈가스*쥬시쿨오이피클 양배추샐러드 후리가케밥4000원 810kcal","TYPE1":"3"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":"치킨마요덮밥볶음김치 꼬치어묵탕3500원 723kcal","TYPE1":"4"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":"진라면 부대라면 유부우동 기본김밥 참치김밥 스팸김밥 다시마야채김밥","TYPE1":"5"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":"도리아(불닭) 치즈매운떡볶이, 삼겹살스테이크 오븐스파게티 로제파스타 계란후라이 소세지치즈철판 불닭,페퍼로니,베이컨피자 [피클]","TYPE1":"6"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":"순대국밥 수육국밥 얼큰국밥[부추*양파초절이]4,800원 5,000원","TYPE1":"7"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200219","MENU":null,"TYPE1":"8"}],"beforeDay":"20200218","foodMenuType4Result":[],"foodMenuType2Result":[]}',
      );
    }),
  };
});

const MenuConverter = require('@domain/converter/MenuConverter');
const MenuConverterImpl = require('@interfaces/converter/MenuConverterImpl');

const CafeteriaRepository = require('@domain/repositories/CafeteriaRepository');
const CafeteriaRepositoryImpl = require('@interfaces/storage/CafeteriaRepositoryImpl');

const converter = new MenuConverter(new MenuConverterImpl());
const repo = new CafeteriaRepository(new CafeteriaRepositoryImpl(converter));

describe('# Cafeteria repository', () => {
  it('shoud get all cafeteria', async () => {
    const result = await repo.getAllCafeteria();

    expect(result.length).toBe(3);

    for (const cafeteria of result) {
      expect(cafeteria).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            imagePath: expect.any(String),
          }),
      );
    }
  });

  it('should get cafeteria with id 2', async () => {
    const result = await repo.getCafeteriaById(2);

    expect(result).toEqual(
        expect.objectContaining({
          id: 2,
          name: expect.any(String),
          imagePath: expect.any(String),
        }),
    );
  });

  it('should get all corners', async () => {
    const result = await repo.getAllCorners();

    expect(result).toBeTruthy();
    expect(result.length).toBe(3);

    for (const corner of result) {
      expect(corner).toEqual(
          expect.objectContaining({
            cafeteriaId: expect.any(Number),
            id: expect.any(Number),
            name: expect.any(String),
          }),
      );
    }
  });

  it('should get corner with id 3', async () => {
    const result = await repo.getCornerById(3);

    expect(result).toEqual(
        expect.objectContaining({
          id: 3,
          name: expect.any(String),
          cafeteriaId: expect.any(Number),
        }),
    );
  });

  it('should get corners with cafeteriaId 2', async () => {
    const result = await repo.getCornersByCafeteriaId(2);

    for (const corner of result) {
      expect(corner).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            cafeteriaId: 2,
          }),
      );
    }
  });

  it('should get all menus 20200219', async () => {
    const converter = new MenuConverter(new MenuConverterImpl());
    const repo = new CafeteriaRepository(new CafeteriaRepositoryImpl(converter));

    const result = await repo.getAllMenus('20200219');
    const expected = [
      {calorie: '759',
        cornerId: 1,
        foods: '삼겹살야채볶음알감자조림 도시락김 속배추된장국 쌀밥',
        price: '3500'},
      {calorie: '747',
        cornerId: 2,
        foods: '차돌순두부찌개동그랑땡 청경채나물 무말랭이무침 쌀밥',
        price: '3500'},
      {calorie: '810',
        cornerId: 3,
        foods: '치즈돈가스*쥬시쿨오이피클 양배추샐러드 후리가케밥',
        price: '4000'},
      {calorie: '723',
        cornerId: 4,
        foods: '치킨마요덮밥볶음김치 꼬치어묵탕',
        price: '3500'},
      {calorie: null,
        cornerId: 5,
        foods: '진라면 부대라면 유부우동 기본김밥 참치김밥 스팸김밥 다시마야채김밥',
        price: null},
      {calorie: null,
        cornerId: 6,
        foods: '도리아(불닭) 치즈매운떡볶이 삼겹살스테이크 오븐스파게티 로제파스타 계란후라이 소세지치즈철판 불닭페퍼로니베이컨피자 [피클]',
        price: null},
      {calorie: null,
        cornerId: 7,
        foods: '순대국밥 수육국밥 얼큰국밥[부추*양파초절이]',
        price: '4800'},
      {calorie: '659',
        cornerId: 12,
        foods: '가자미튀김강정 짜장우동면 두부김치국 비엔나케찹조림 김구이*양념장 케일치커리겉절이 깍두기 흑미밥',
        price: '5500'},
      {calorie: null,
        cornerId: 12,
        foods: '순대국밥/수육국밥 [부추+양파절임+김치+밥]',
        price: '5500'},
      {calorie: null, cornerId: 12, foods: '셀프라면', price: '2000'},
      {calorie: '837',
        cornerId: 17,
        foods: '스팸*후라이*볶음김치 냉이된장국 순대야채볶음 우엉떡조림 열무나물 참나물유자무침 깍두기/흑미밥',
        price: '5500'},
      {calorie: '816',
        cornerId: 18,
        foods: '데리야끼장각구이 냉이된장국 미니돈까스*케찹 느타리햄볶음 수제피클 콩나물무침 포기김치/흑미밥',
        price: '5500'},
    ];

    expect(result).toEqual(expected);
  });
});
