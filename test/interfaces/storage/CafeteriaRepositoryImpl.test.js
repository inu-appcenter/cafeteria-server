'use strict';

const sqeulize = require('@infrastructure/database/sequelize');

const MenuConverter = require('@domain/converter/MenuConverter');
const MenuConverterImpl = require('@interfaces/converter/MenuConverterImpl');

const CafeteriaRepository = require('@domain/repositories/CafeteriaRepository');
const CafeteriaRepositoryImpl = require('@interfaces/storage/CafeteriaRepositoryImpl');

const converter = new MenuConverter(new MenuConverterImpl());
const repo = new CafeteriaRepository(new CafeteriaRepositoryImpl(converter));

describe('# Cafeteria repository', () => {

	it('shoud get all cafeterias', async () => {

		const result = await repo.getCafeterias();

		expect(result).toBeTruthy();
		expect(result.length).toBeGreaterThan(0);

		for (var cafeteria of result) {
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

		const result = await repo.getCafeterias({ id: 2 });

		expect(result).toEqual(
			expect.objectContaining({
				id: 2,
				name: expect.any(String),
				imagePath: expect.any(String),
			})
		);
	});

	it('should get all corners', async () => {

		const result = await repo.getCorners();

		expect(result).toBeTruthy();
		expect(result.length).toBeGreaterThan(0);

		for (var corner of result) {
			expect(corner).toEqual(
				expect.objectContaining({
					cafeteriaId: expect.any(Number),
					id: expect.any(Number),
					name: expect.any(String)
				}),
			);
		}
	});

	it('should get corner with id 3', async () => {

		const result = await repo.getCorners({ id: 3 });

		expect(result).toEqual(
			expect.objectContaining({
				id: 3,
				name: expect.any(String),
				cafeteriaId: expect.any(Number)
			})
		);
	});

	it('should get corners with cafeteriaId 2', async () => {

		const result = await repo.getCorners({ cafeteriaId: 2 });

		for (var corner of result) {
			expect(corner).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					name: expect.any(String),
					cafeteriaId: 2
				})
			);
		}
	});

	it('should get corner with id 7 and cafeteriaId 1', async () => {

		const result = await repo.getCorners({ id: 7, cafeteriaId: 1 });

		expect(result).toEqual(
			expect.objectContaining({
				id: 7,
				name: expect.any(String),
				cafeteriaId: 1
			})
		);
	})

	it('should not get corner with id 17 and cafeteriaId 2', async () => {

		const result = await repo.getCorners({ id: 17, cafeteriaId: 1 });

		expect(result).toBeFalsy();
	});

	it('should get all menus 20200219', async () => {

		const converter = new MenuConverter(new MenuConverterImpl());
		const repo = new CafeteriaRepository(new CafeteriaRepositoryImpl(converter));

		const result = await repo.getMenus({ date: '20200219' });
		const expected = [
			{ calorie: '759',
			  cornerId: 1,
			  foods: '삼겹살야채볶음알감자조림 도시락김 속배추된장국 쌀밥',
			  price: '3500' },
			{ calorie: '747',
			  cornerId: 2,
			  foods: '차돌순두부찌개동그랑땡 청경채나물 무말랭이무침 쌀밥',
			  price: '3500' },
			{ calorie: '810',
			  cornerId: 3,
			  foods: '치즈돈가스*쥬시쿨오이피클 양배추샐러드 후리가케밥',
			  price: '4000' },
			{ calorie: '723',
			  cornerId: 4,
			  foods: '치킨마요덮밥볶음김치 꼬치어묵탕',
			  price: '3500' },
			{ calorie: null,
			  cornerId: 5,
			  foods: '진라면 부대라면 유부우동 기본김밥 참치김밥 스팸김밥 다시마야채김밥',
			  price: null },
			{ calorie: null,
			  cornerId: 6,
			  foods: '도리아(불닭) 치즈매운떡볶이 삼겹살스테이크 오븐스파게티 로제파스타 계란후라이 소세지치즈철판 불닭페퍼로니베이컨피자 [피클]',
			  price: null },
			{ calorie: null,
			  cornerId: 7,
			  foods: '순대국밥 수육국밥 얼큰국밥[부추*양파초절이]',
			  price: '4800' },
			{ calorie: '659',
			  cornerId: 12,
			  foods: '가자미튀김강정 짜장우동면 두부김치국 비엔나케찹조림 김구이*양념장 케일치커리겉절이 깍두기 흑미밥',
			  price: '5500' },
			{ calorie: null,
			  cornerId: 12,
			  foods: '순대국밥/수육국밥 [부추+양파절임+김치+밥]',
			  price: '5500' },
			{ calorie: null, cornerId: 12, foods: '셀프라면', price: '2000' },
			{ calorie: '837',
			  cornerId: 17,
			  foods: '스팸*후라이*볶음김치 냉이된장국 순대야채볶음 우엉떡조림 열무나물 참나물유자무침 깍두기/흑미밥',
			  price: '5500' },
			{ calorie: '816',
			  cornerId: 18,
			  foods: '데리야끼장각구이 냉이된장국 미니돈까스*케찹 느타리햄볶음 수제피클 콩나물무침 포기김치/흑미밥',
			  price: '5500' }
	  	];

		expect(result).toEqual(expected);
	});

});
